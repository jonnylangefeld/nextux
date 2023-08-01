import { google } from "@google-cloud/speech/build/protos/protos"
import { GoogleAuth } from "google-auth-library"
import { google as googleapis, speech_v1p1beta1 } from "googleapis"
import _ from "lodash"
import { ApiError } from "next/dist/server/api-utils"
import { ChatCompletionRequestMessage, Configuration, CreateChatCompletionRequest, OpenAIApi } from "openai"
import { env } from "@/app/lib/environment/environment"

let authClient: GoogleAuth | undefined = undefined

/**
 * Creates a Google Auth client
 * @returns The Google Auth client
 */
function getAuth(): GoogleAuth {
  if (!authClient) {
    const credentials = JSON.parse(env.GOOGLE_APPLICATION_CREDENTIALS_JSON)
    authClient = new googleapis.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/cloud-platform", "https://www.googleapis.com/auth/cloud-vision"],
    })
  }
  return authClient
}

/**
 * Creates a Google Cloud Speech client
 * @returns The Google Cloud Speech client
 */
export function speechClient(): speech_v1p1beta1.Speech {
  return googleapis.speech({
    version: "v1p1beta1",
    auth: getAuth(),
  })
}
const speech = speechClient()

/**
 * Creates an OpenAI client
 * @returns The OpenAI client
 */
export function openAIClient() {
  const openAIConfiguration = new Configuration({
    apiKey: env.OPENAI_API_KEY,
  })
  return new OpenAIApi(openAIConfiguration)
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
  const encoding = Object.keys(google.cloud.speech.v1p1beta1.RecognitionConfig.AudioEncoding)[
    google.cloud.speech.v1p1beta1.RecognitionConfig.AudioEncoding.MP3
  ]
  const response = await speech.speech.recognize({
    requestBody: {
      audio: {
        content: base64File,
      },
      config: {
        enableAutomaticPunctuation: false,
        encoding,
        sampleRateHertz: 24000,
        model: "default",
        maxAlternatives: 1,
        languageCode: "en-US",
        useEnhanced: true,
      },
    },
  })

  if (!response.data.results || response.data.results.length === 0) {
    throw new ApiError(500, "couldn't extract text from file")
  }

  const transcript = response.data.results
    .map((result) => {
      if (!result || !result.alternatives || result.alternatives.length === 0) {
        throw new ApiError(500, "couldn't extract text from file")
      }
      return result.alternatives[0].transcript
    })
    .join(" ")

  console.log({ transcript })
  return transcript
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
This is typically in the form of '[original word] spelled [o r i g i n a l w o r d]'.

Examples:

Joseph spelled j o s e f
Danielle spelled d a n i e l l
Nicholas spelled n i k o l a s

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
  } as CreateChatCompletionRequest

  let spelledOutWords: { wordList: { originalWord: string; spelledOutWord: string }[] } = { wordList: [] }
  try {
    const response = await openAI.createChatCompletion(getSpellingsRequest)
    const args = response?.data?.choices?.[0]?.message?.function_call?.arguments
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

  const messages: ChatCompletionRequestMessage[] = [
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
        spelledOutWord: _.startCase(item.spelledOutWord.replace(/(?<! ) (?! )/g, "").replace(/ +/g, " ")),
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
  } as CreateChatCompletionRequest

  try {
    const response = await openAI.createChatCompletion(chatCompletionRequest)
    const args = response?.data?.choices?.[0]?.message?.function_call?.arguments
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
