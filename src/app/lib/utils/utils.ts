import crypto from "crypto"
import { FileType } from "../types"

const magicNumbers: Record<FileType, string> = {
  [FileType.MP3]: "fffa",
  [FileType.WEBM]: "1a45df",
  [FileType.MP4]: "0000001c6674",
  [FileType.WAV]: "52494646",
}

/**
 * Check if a string is a valid base64 string of a specific file type
 * @param base64 The base64 string to be evaluated
 * @param expectedFileType The expected file type
 * @returns A boolean indicating whether the string is a valid base64 of the expected file type
 */
export function isBase64FileType(base64: string, expectedFileType: FileType): boolean {
  const base64Buffer = Buffer.from(base64, "base64")
  const magicNumber = magicNumbers[expectedFileType]
  const expectedLength = magicNumber.length / 2 // Each byte is represented by 2 characters in the hex string
  const fileMagicNumber = base64Buffer.toString("hex", 0, expectedLength)

  return magicNumber === fileMagicNumber
}

/**
 * Convert a base64 string to a SHA256 hash
 * @param base64File The base64 string to be converted
 * @returns A SHA256 hash of the base64 string
 */
export function base64ToHash(base64File: string): string {
  const buffer = Buffer.from(base64File, "base64")
  return bufferToHash(buffer)
}

/**
 * Convert a buffer to a SHA256 hash
 * @param buffer The buffer to be converted
 * @returns A SHA256 hash of the buffer
 */
export function bufferToHash(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex")
}
