import NodeHttpAdapter from "@pollyjs/adapter-node-http"
import FSPersister from "@pollyjs/persister-fs"
import { setupPolly } from "setup-polly-jest"
import path from "path"
import { FileType } from "@/app/lib/types"
import { bad, complex, complexLong, contact, creditCard, simple } from "./data.test"
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
    const got = await extractFileText(simple.fileBase64, FileType.MP3)

    expect(got).toEqual(simple.transcript)
  })

  it("should extract a complex mp3 file", async () => {
    const got = await extractFileText(complex.fileBase64, FileType.MP3)

    expect(got).toEqual(complex.transcript)
  })

  it("should extract a longer complex mp3 file", async () => {
    const got = await extractFileText(complexLong.fileBase64, FileType.MP3)

    expect(got).toEqual(complexLong.transcript)
  })

  it("should extract a contact mp3 file", async () => {
    const got = await extractFileText(contact.fileBase64, FileType.MP3)

    expect(got).toEqual(contact.transcript)
  })

  it("should extract a creditCard mp3 file", async () => {
    const got = await extractFileText(creditCard.fileBase64, FileType.MP3)

    expect(got).toEqual(creditCard.transcript)
  })

  it("should extract a bad mp3 file", async () => {
    // This example was spoken without a headset. Just the microphone of the computer.
    const got = await extractFileText(bad.fileBase64, FileType.MP3)

    expect(got).toEqual(bad.transcript)
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

  it("contact example", async () => {
    const got = await extractStructuredData(contact.transcript, contact.jsonSchema)

    expect(got).toBeDefined()
    expect(got).toEqual(
      expect.objectContaining({
        firstName: "Jonny",
        lastName: "Langefeld",
        address: {
          street: "1 Ferry Building",
          city: "San Francisco",
          stateAbbreviation: "CA",
          zipCode: "94105",
        },
        emailAddress: "jonnylangefeld@gmail.com",
        birthDate: "1991-07-22",
      })
    )
  })

  it("credit card example", async () => {
    const got = await extractStructuredData(creditCard.transcript, creditCard.jsonSchema)

    expect(got).toBeDefined()
    expect(got).toEqual(
      expect.objectContaining({
        cardNumber: "1234567886754321",
        cardholderName: "Jonny Langefeld",
        expirationDate: {
          month: 10,
          year: 2024,
        },
        cvv: "431",
      })
    )
  })

  it("bad example", async () => {
    const got = await extractStructuredData(bad.transcript, creditCard.jsonSchema)

    expect(got).toBeDefined()
    expect(got).toEqual(
      expect.objectContaining({
        cardNumber: "1234",
        cardholderName: "",
        expirationDate: {
          month: 0,
          year: 0,
        },
        cvv: "",
      })
    )
  })
})
