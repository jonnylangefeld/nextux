import NodeHttpAdapter from "@pollyjs/adapter-node-http"
import FSPersister from "@pollyjs/persister-fs"
import { setupPolly } from "setup-polly-jest"
import path from "path"
import { complex, complexLong, simple } from "./data.test"
import { extractFileText, extractStructuredData } from "./functions"

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
    const got = await extractFileText(simple.fileBase64)

    expect(got).toEqual(simple.transcript)
  })

  it("should extract a complex mp3 file", async () => {
    const got = await extractFileText(complex.fileBase64)

    expect(got).toEqual(complex.transcript)
  })

  it("should extract a longer complex mp3 file", async () => {
    const got = await extractFileText(complexLong.fileBase64)

    expect(got).toEqual(complexLong.transcript)
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
    const got = await extractStructuredData(simple.transcript, simple.jsonSchema)

    expect(got).toBeDefined()
    expect(got).toStrictEqual({ content: simple.transcript })
  })

  it("complex example", async () => {
    const got = await extractStructuredData(complex.transcript, complex.jsonSchema)

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
