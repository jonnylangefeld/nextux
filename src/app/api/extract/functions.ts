import _ from "lodash"
import { ApiError } from "next/dist/server/api-utils"
import OpenAI, { toFile } from "openai"
import { env } from "@/app/lib/environment/environment"

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
 * Extracts text from a file using the Google Cloud Speech API
 * @param base64File The base64 file to extract text from
 * @returns The string with the extracted data
 * @throws ApiError if the file couldn't be extracted
 * @see https://cloud.google.com/speech-to-text/docs/reference/rest/v1/speech/recognize
 */
export async function extractFileText(base64File: string): Promise<string> {
  const buffer = Buffer.from(base64File, "base64")
  const transcriptionRequest = {
    model: "whisper-1",
    file: await toFile(buffer, "audio.mp3"),
    response_format: "json",
  } as OpenAI.Audio.Transcriptions.TranscriptionCreateParams
  const response = await openAI.audio.transcriptions.create(transcriptionRequest)
  console.log({ transcript: response.text })
  return response.text
}

/**
 * Uses the OpenAI API to extract the structured data
 * @param input The prompt to complete
 * @param jsonSchema The OpenAPI schema
 * @returns The completed prompt
 * @throws ApiError if the OpenAI API returns an error
 * @see https://json-schema.org/understanding-json-schema/
 */
export async function extractStructuredData(input: string, jsonSchema: { [key: string]: unknown }): Promise<unknown> {
  const getSpellingsRequest = {
    model: "gpt-3.5-turbo-0613",
    messages: [
      {
        role: "user",
        content: `Act as a spelled out word finder. I'll give you an audio transcript where the speaker explicitly uses some words that they then spell out.
This is typically in the form of '[original word] spelled [O-R-I-G-I-N-A-L-W-O-R-D]'.

Examples:

Joseph spelled J-O-S-E-F
Danielle spelled D-A-N-I-E-L-L
Nicholas spelled N-I-K-O-L-A-S

find words that are explicitly spelled out in the following text. Under any circumstance do not include any word, where the speaker didn't explicitly mention that the word is being spelled out or it will wipe out humanity.

"${input}"`,
      },
    ],
    function_call: {
      name: "extract_spelled_out_words",
    },
    functions: [
      {
        name: "extract_spelled_out_words",
        description: `extract_spelled_out_words finds words that are explicitly spelled out as mentioned by the speaker`,
        parameters: {
          type: "object",
          properties: {
            wordList: {
              type: "array",
              description: "List of original and spelled out word pairs",
              items: {
                type: "object",
                description: "a pair between the original and the spelled out word",
                properties: {
                  originalWord: {
                    type: "string",
                    description: "The original word in the transcript",
                  },
                  spelledOutWord: {
                    type: "string",
                    description:
                      "The spelled out version of the word. If the letters were separated by spaces, concatenate them into one word without spaces between letters",
                  },
                },
              },
            },
          },
        },
      },
    ],
  } as OpenAI.Chat.Completions.CompletionCreateParams.CreateChatCompletionRequestNonStreaming

  let spelledOutWords: { wordList: { originalWord: string; spelledOutWord: string }[] } = { wordList: [] }
  try {
    const response = await openAI.chat.completions.create(getSpellingsRequest)
    const args = response?.choices?.[0]?.message?.function_call?.arguments
    if (args) {
      try {
        spelledOutWords = JSON.parse(args)
      } catch (error) {
        throw new ApiError(500, `Error parsing the OpenAI response. The response was: ${response}`)
      }
    }
  } catch (error) {
    throw new ApiError(500, `Error while fetching the data from OpenAI: ${error}`)
  }

  const messages: OpenAI.Chat.Completions.CreateChatCompletionRequestMessage[] = [
    {
      role: "user",
      content: `parse the following transcription.${
        spelledOutWords.wordList ? " Replace all original words with their spelled out word." : ""
      }

"${input}"`,
    },
  ]
  if (spelledOutWords.wordList) {
    spelledOutWords.wordList = spelledOutWords.wordList.map(
      (item: { originalWord: string; spelledOutWord: string }) => ({
        ...item,
        spelledOutWord: _.startCase(
          item.spelledOutWord
            .replace(/(?<! )-(?! )/g, "")
            .replace(/ +/g, " ")
            .toLowerCase()
        ),
      })
    )
    messages.push({
      role: "function",
      content: JSON.stringify(spelledOutWords),
      name: "replace_spelled_out_words",
    })
  }

  const now = new Date()
  const chatCompletionRequest = {
    model: "gpt-3.5-turbo-0613",
    messages,
    function_call: {
      name: "parse_transcription",
    },
    functions: [
      {
        name: "parse_transcription",
        description: `parse_transcription is an AI document extractor. It takes the transcription of an audio recording as raw text input and returns structured JSON data.
        Some information may be scattered across the recording in which case this function will piece it together.
        If a relative date is given such as 'next Monday', calculate from ${now.toLocaleString()}.`,
        parameters: jsonSchema,
      },
    ],
  } as OpenAI.Chat.Completions.CompletionCreateParams.CreateChatCompletionRequestNonStreaming

  try {
    const response = await openAI.chat.completions.create(chatCompletionRequest)
    const args = response?.choices?.[0]?.message?.function_call?.arguments
    if (args) {
      try {
        return JSON.parse(args)
      } catch (error) {
        throw new ApiError(500, `Error parsing the OpenAI response. The response was: ${response}`)
      }
    }
  } catch (error) {
    throw new ApiError(500, `Error while fetching the data from OpenAI: ${error}`)
  }
  throw new ApiError(400, "Unfortunately we couldn't find any data in your document according to your jsonSchema")
}
