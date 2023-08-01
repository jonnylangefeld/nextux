import { NextResponse } from "next/server"

export const errors = {
  InvalidDocument: "document is not a valid base64 or not an accepted document type",
  InvalidJSONSchema:
    "the given json schema isn't valid. You can try out your schema with https://www.jsonschemavalidator.net/",
  InvalidRequestBody: "the request body is invalid",
  InternalError: "Oops, something went wrong. This shouldn't have happened and we'll fix it promptly.",
}

/**
 * Helper function to return an API error response
 * @param error Error message to return
 * @param status HTTP status code to return
 * @param details optional details to describe the error better
 * @returns A NextResponse object with the error message and status code
 */
export function apiError(error: string, status?: number, details?: unknown): NextResponse {
  if (!status) {
    status = 400
  }
  return NextResponse.json({ error, details }, { status })
}
