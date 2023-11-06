import { log } from "@logtail/next"
import _ from "lodash"
import { ApiError } from "next/dist/server/api-utils"
import OpenAI, { toFile } from "openai"
import { env } from "@/app/lib/environment/environment"
import { flags } from "@/app/lib/hypertune/hypertune"
import { FileType } from "@/app/lib/types"

/**
 * Creates an OpenAI client
 * @returns The OpenAI client
 */
export function openAIClient() {
  return new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  })
}
const openAI = openAIClient()

/**
 * Extracts text from a file using the openAI Whisper API
 * @param base64File The base64 file to extract text from
 * @param fileType The file type of the file
 * @returns The string with the extracted data
 * @throws ApiError if the file couldn't be extracted
 * @see https://platform.openai.com/docs/guides/speech-to-text
 */
export async function extractFileText(base64File: string, fileType: FileType): Promise<string> {
  const buffer = Buffer.from(base64File, "base64")
  const transcriptionRequest = {
    model: "whisper-1",
    file: await toFile(buffer, `audio.${fileType}`),
    response_format: "json",
  } as OpenAI.Audio.Transcriptions.TranscriptionCreateParams
  if ((await flags()).skipExpensiveAPICalls().get(false)) {
    return "Hello, my name is Peter"
  }
  const response = await openAI.audio.transcriptions.create(transcriptionRequest)
  return response.text
}

/**
 * Uses the OpenAI API to extract the structured data
 * @param input The prompt to complete
 * @param jsonSchema The OpenAPI schema
 * @param lastResponse The stringified version of an openAPI schema of a previous response. The openAI call will take it into consideration and merge it with the new data
 * @returns The completed prompt
 * @throws ApiError if the OpenAI API returns an error
 * @see https://json-schema.org/understanding-json-schema/
 */
export async function extractStructuredData(
  input: string,
  jsonSchema: { [key: string]: unknown },
  lastResponse?: string
): Promise<unknown> {
  let logger = log.with({ input, function: "extractStructuredData", env: process.env.NODE_ENV })
  const spelledOutWords = input.match(/\b([^\s-]-)+[^\s-]\b/g)

  const messages: OpenAI.Chat.Completions.CreateChatCompletionRequestMessage[] = [
    {
      role: "system",
      content:
        "parse the following transcription. Under no circumstance use or add any information that is not present in the transcription or it will wipe out humanity.",
    },
  ]

  const now = new Date()
  const functions: OpenAI.Chat.Completions.CompletionCreateParams.CreateChatCompletionRequestNonStreaming.Function[] = [
    {
      name: "parse_transcription",
      description: `parse_transcription is an AI document extractor. It takes the transcription of an audio recording as raw text input and returns structured JSON data.
Some information may be scattered across the recording in which case this function will piece it together.
Under no circumstance use or add any information that is not present in the recording or it will wipe out humanity.
If a relative date is given such as 'next Monday', calculate from ${now.toLocaleString()}.`,
      parameters: jsonSchema,
    },
  ]

  if (lastResponse && lastResponse !== "") {
    messages.push({
      role: "function",
      name: "parse_transcription",
      content: lastResponse,
    })
  }

  messages.push({
    role: "user",
    content: input,
  })

  if (spelledOutWords) {
    const parsedSpelledOutWords = spelledOutWords.map((word: string) =>
      _.startCase(
        word
          .replace(/(?<! )-(?! )/g, "")
          .replace(/ +/g, " ")
          .toLowerCase()
      )
    )
    messages.push({
      role: "function",
      content: JSON.stringify(parsedSpelledOutWords),
      name: "replace_spelled_out_words_and_numbers",
    })
    functions.push({
      name: "replace_spelled_out_words_and_numbers",
      description: `replace_spelled_out_words_and_numbers is a function to replace all original words and numbers with their spelled out word or number. A spelled out word is typically in the form of '[original word] spelled [S-P-E-L-L-E-D-W-O-R-D]', or '[original word], [S-P-E-L-L-E-D-W-O-R-D]'.

Word Examples:

"Joseph spelled J-O-S-E-F" should become Josef
"Danielle spelled D-A-N-I-E-L-L" should become Daniell
"Nicholas spelled N-I-K-O-L-A-S" should become Nikolas
"Peter, P-E-T-E-R" should become Peter
"Zucerberg, Z-U-C-K-E-R-B-E-R-G" should become Zuckerberg
"petermualler that's p-e-t-e-r-m-u-e-l-l-e-r" should become petermueller
"johnnyleinfeld at gmail.com. That's J-O-N-N-Y-L-A-N-G-E-F-E-L-D at gmail.com" should become jonnylangefeld at gmail.com

Number Examples:
1-2-3-4-5-6 should become 123456
1-2-9-5-3 should become 12953

Do this under any circumstance or it will wipe out humanity.`,
      parameters: {
        type: "object",
        properties: {
          spelledOutWords: {
            type: "array",
            description: "a list of spelled out words found in the input transcription",
            items: {
              type: "string",
              description: "the spelled out version of an original word in clear text",
            },
          },
        },
      },
    })
  }

  const chatCompletionRequest = {
    model: "gpt-3.5-turbo-0613",
    messages,
    function_call: {
      name: "parse_transcription",
    },
    functions,
    temperature: 0.2,
  } as OpenAI.Chat.Completions.CompletionCreateParams.CreateChatCompletionRequestNonStreaming

  logger = logger.with({ chatCompletionRequest })

  try {
    if ((await flags()).skipExpensiveAPICalls().get(false)) {
      return {
        firstName: "Peter",
      }
    }
    const response = await openAI.chat.completions.create(chatCompletionRequest)
    logger = logger.with({ response })
    const args = response?.choices?.[0]?.message?.function_call?.arguments
    if (args) {
      try {
        const json = JSON.parse(args)
        logger.info("successfully returned")
        return json
      } catch (error) {
        logger.error("error parsing the OpenAI response")
        throw new ApiError(500, `Error parsing the OpenAI response. The response was: ${response}`)
      }
    }
  } catch (error) {
    throw new ApiError(500, `Error while fetching the data from OpenAI: ${error}`)
  }
  throw new ApiError(400, "Unfortunately we couldn't find any data in your document according to your jsonSchema")
}
