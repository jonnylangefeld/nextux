import { ApiError } from "next/dist/server/api-utils"
import { NextRequest } from "next/server"
import fs from "fs"
import path from "path"
import { errors } from "@/app/lib/errors/errors"
import { extractFileText, extractStructuredData } from "./functions"
import { POST } from "./route"

jest.mock("./functions")
const extractFileTextMock = extractFileText as jest.MockedFunction<typeof extractFileText>
const extractStructuredDataMock = extractStructuredData as jest.MockedFunction<typeof extractStructuredData>

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
const simpleJsonSchemaBase64 = Buffer.from(JSON.stringify(simpleJsonSchema)).toString("base64")

describe("GET /api/extract", () => {
  afterAll(() => {
    jest.resetAllMocks()
  })

  it("should throw an error if mandatory fields are missing", async () => {
    const req = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({ foo: "bar" }),
    })

    const got = await POST(req)

    expect(await got.json()).toMatchObject({
      error: errors.InvalidRequestBody,
      details: {
        issues: [
          {
            code: "invalid_type",
            expected: "string",
            message: "Required",
            path: ["document"],
            received: "undefined",
          },
          {
            code: "invalid_type",
            expected: "string",
            message: "Required",
            path: ["jsonSchema"],
            received: "undefined",
          },
        ],
        name: "ZodError",
      },
    })
    expect(got.status).toBe(400)
  })

  it("should throw an error if body is not valid json", async () => {
    const req = new NextRequest("http://localhost", {
      method: "POST",
      body: "foo",
    })

    const got = await POST(req)

    expect(await got.json()).toMatchObject({
      error: errors.InvalidRequestBody,
      details: "SyntaxError: Unexpected token o in JSON at position 1",
    })
    expect(got.status).toBe(400)
  })

  it("should throw an error if the document is not a valid base64 PDF or PNG", async () => {
    const req = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({ document: "foo", jsonSchema: simpleJsonSchemaBase64 }),
    })

    const got = await POST(req)

    expect(await got.json()).toMatchObject({
      error: errors.InvalidDocument,
    })
    expect(got.status).toBe(400)
  })

  it("should return the extracted text in structured format", async () => {
    extractFileTextMock.mockResolvedValue("Hello world.")
    extractStructuredDataMock.mockResolvedValue({
      content: "Hello world.",
    })
    const req = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({ document: simpleFileBase64, jsonSchema: simpleJsonSchemaBase64 }),
    })

    const got = await POST(req)

    expect(await got.json()).toMatchObject({
      content: "Hello world.",
    })
    expect(got.status).toBe(200)
  })

  it("should return an error if the json schema wasn't valid json", async () => {
    const req = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({ document: simpleFileBase64, jsonSchema: "bar" }),
    })

    const got = await POST(req)

    expect(await got.json()).toMatchObject({
      error: errors.InvalidJSONSchema,
      details: "SyntaxError: Unexpected token m in JSON at position 0",
    })
    expect(got.status).toBe(400)
  })

  it("should return an error if the json schema is valid json but not a valid json schema", async () => {
    const jsonSchema = Buffer.from(
      JSON.stringify({
        $schema: "http://json-schema.org/draft-07/schema#",
        foo: {
          helloWorld: {
            type: "string",
            description: "Just the string 'Hello, world!'",
          },
        },
      })
    ).toString("base64")
    const req = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({ document: simpleFileBase64, jsonSchema }),
    })

    const got = await POST(req)

    expect(await got.json()).toMatchObject({
      error: errors.InvalidJSONSchema,
      details: "Error: unknown keyword: foo",
    })
    expect(got.status).toBe(400)
  })

  it("should return a 500 error and log the error if there was an OpenAI error", async () => {
    const originalError = console.error
    console.error = jest.fn()

    extractFileTextMock.mockResolvedValue("Hello world.")
    extractStructuredDataMock.mockRejectedValueOnce(new ApiError(500, "Error while fetching the data from OpenAI"))
    const req = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({ document: simpleFileBase64, jsonSchema: simpleJsonSchemaBase64 }),
    })

    const got = await POST(req)

    expect(await got.json()).toMatchObject({
      error: errors.InternalError,
    })
    expect(got.status).toBe(500)
    expect(console.error).toHaveBeenCalledTimes(1)

    console.error = originalError
  })
})
