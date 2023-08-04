import NodeHttpAdapter from "@pollyjs/adapter-node-http"
import FSPersister from "@pollyjs/persister-fs"
import { setupPolly } from "setup-polly-jest"
import fs from "fs"
import path from "path"
import { extractFileText, extractStructuredData } from "./functions"

const simpleFileBuffer = fs.readFileSync(path.resolve(__dirname, "../../__testdata__/simple.mp3"))
const simpleFileBase64 = simpleFileBuffer.toString("base64")
const simpleJsonSchema = {
  type: "object",
  properties: {
    content: {
      type: "string",
      description: "The entire content",
    },
  },
}
const simpleTranscript = "Hello, world."

const complexFileBuffer = fs.readFileSync(path.resolve(__dirname, "../../__testdata__/complex.mp3"))
const complexFileBase64 = complexFileBuffer.toString("base64")
const complexJsonSchema = {
  type: "object",
  properties: {
    travelers: {
      type: "array",
      description: "List of travelers",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description:
              "The name of the traveler. If it contains a spelled out version of the name, respond by concatenating the spelled out letters into one word.",
          },
        },
      },
    },
    fromAirportCodes: {
      type: "array",
      description: "List of IATA airport codes for the departure airport",
      items: {
        type: "string",
        description: "three letter airport code. If a city is given, transform into the major airport code.",
        minLength: 3,
        maxLength: 3,
        pattern: "^[A-Z]{3}$",
        examples: ["JFK", "MUC", "BER", "CDG", "SIN", "FRA", "MEX"],
      },
    },
    toAirportCodes: {
      type: "array",
      description: "List of IATA airport codes for the destination airport",
      items: {
        type: "string",
        description: "three letter airport code. If a city is given, transform into the major airport code.",
        minLength: 3,
        maxLength: 3,
        pattern: "^[A-Z]{3}$",
        examples: ["JFK", "MUC", "BER", "CDG", "SIN", "FRA", "MEX"],
      },
    },
    fromDate: {
      type: "string",
      description: "The date of departure in the format YYYY-MM-DD",
    },
    toDate: {
      type: "string",
      description: "The date of arrival in the format YYYY-MM-DD",
    },
  },
}
const complexTranscript =
  "Okay, so my name is Johnny, that's spelled J-O-N-N-Y, and I want to travel with my wife, Mackenzie, that's spelled M-C-K-E-N-Z-I-E, from any airport in and around San Francisco, like SFO, or Oakland, or San Jose. And we want to fly down to LA, and we want to travel next Wednesday through Sunday."

const context = setupPolly({
  adapters: [NodeHttpAdapter],
  persister: FSPersister,
  persisterOptions: {
    fs: {
      recordingsDir: path.resolve(__dirname, "__recordings__"),
    },
  },
  recordFailedRequests: true,
  recordIfMissing: true,
  matchRequestsBy: {
    url: true,
    method: true,
    headers: false,
    body: false,
    order: false,
  },
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stripTokens = (_: any, recording: any) => {
  if (recording) {
    if (recording.request) {
      if (recording.request.headers) {
        recording.request.headers = recording.request.headers.map((header: { name: string; value: string }) => {
          if (header.name === "authorization") {
            header.value = "Bearer: test-token"
          }
          return header
        })
      }
      if (recording.request.url === "https://www.googleapis.com/oauth2/v4/token") {
        recording.request.postData.text = recording.request.postData.text.replace(
          /assertion=.*$/,
          "assertion=test-token"
        )
        recording.response.content.text = "[]"
      }
    }
  }
}

describe("extractFileText", () => {
  beforeEach(() => {
    const { server } = context.polly
    server.any().on("beforePersist", stripTokens)
  })

  it("should extract a simple mp3 file", async () => {
    const got = await extractFileText(simpleFileBase64)

    expect(got).toEqual(simpleTranscript)
  })

  it("should extract a complex mp3 file", async () => {
    const got = await extractFileText(complexFileBase64)

    expect(got).toEqual(complexTranscript)
  })

  it("should extract a longer complex mp3 file", async () => {
    const fileBuffer = fs.readFileSync(path.resolve(__dirname, "../../__testdata__/complex-long.mp3"))
    const fileBase64 = fileBuffer.toString("base64")
    const got = await extractFileText(fileBase64)

    expect(got).toEqual(
      "So my name is Johnny, and that's spelled J-O-N-N-Y, and I'm traveling with my wife, that's spelled M-C-K-E-N-Z-I-E, and we want to travel from any airport in or around San Francisco, like SFO or Oakland or San Jose, and we want to travel to Los Angeles, and we would like to fly next Wednesday through Sunday."
    )
  })
})

describe("extractStructuredData", () => {
  beforeEach(() => {
    const { server } = context.polly
    server.any().on("beforePersist", stripTokens)
    context.polly.configure({
      matchRequestsBy: {
        order: true,
      },
    })
  })

  it("simple example", async () => {
    const got = await extractStructuredData(simpleTranscript, simpleJsonSchema)

    expect(got).toBeDefined()
    expect(got).toStrictEqual({ content: simpleTranscript })
  })

  it("complex example", async () => {
    const got = await extractStructuredData(complexTranscript, complexJsonSchema)

    expect(got).toBeDefined()
    expect(got).toEqual(
      expect.objectContaining({
        fromAirportCodes: ["SFO", "OAK", "SJC"],
        toAirportCodes: ["LAX"],
        fromDate: "2023-08-09",
        toDate: "2023-08-13",
        travelers: [{ name: "Jonny" }, { name: "Mckenzie" }],
      })
    )
  })
})
