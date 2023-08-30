import fs from "fs"
import path from "path"
import { base64ToHash, bufferToHash, isBase64FileType } from "./utils"
import { FileType } from "../types"

describe("isBase64FileType", () => {
  it("should correctly identify a valid base64 MP3", async () => {
    const mp3Buffer = fs.readFileSync(path.resolve(__dirname, "../../__testdata__/simple.mp3"))
    const base64Mp3 = mp3Buffer.toString("base64")
    const result = isBase64FileType(base64Mp3, FileType.MP3)
    expect(result).toBe(true)
  })

  it("should correctly identify a valid base64 WEBM", async () => {
    const webmBuffer = fs.readFileSync(path.resolve(__dirname, "../../__testdata__/contact.webm"))
    const base64Webm = webmBuffer.toString("base64")
    const result = isBase64FileType(base64Webm, FileType.WEBM)
    expect(result).toBe(true)
  })

  it("should return false for an invalid file type", async () => {
    const invalidBuffer = Buffer.from("invalid-base64-string")
    const base64Invalid = invalidBuffer.toString("base64")
    const result = await isBase64FileType(base64Invalid, FileType.MP3)
    expect(result).toBe(false)
  })
})

describe("base64FileToSHA256Hash", () => {
  it("should return the correct SHA256 hash for a base64 file", () => {
    const base64File = "SGVsbG8gd29ybGQ="

    const want = "64ec88ca00b268e5ba1a35678a1b5316d212f4f366b2477232534a8aeca37f3c"
    const got = base64ToHash(base64File)

    expect(got).toBe(want)
  })

  it("should produce consistent hash lengths for 10 random files", () => {
    const numFiles = 10

    for (let i = 0; i < numFiles; i++) {
      const randomData = Math.random().toString()
      const base64File = Buffer.from(randomData).toString("base64")

      const got = base64ToHash(base64File)

      // Ensure the hash length is always 64 characters (256 bits)
      expect(got.length).toBe(64)
    }
  })
})

describe("bufferToHash", () => {
  it("should return the correct SHA256 hash for a buffer", () => {
    const inputData = "Hello world"
    const buffer = Buffer.from(inputData)

    const expectedHash = "64ec88ca00b268e5ba1a35678a1b5316d212f4f366b2477232534a8aeca37f3c" // Expected SHA256 hash for "Hello world"
    const actualHash = bufferToHash(buffer)

    expect(actualHash).toBe(expectedHash)
  })
})
