import Ajv from "ajv"
import { ApiError } from "next/dist/server/api-utils"
import { NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
import { constants } from "@/app/lib/constants"
import { errors } from "@/app/lib/errors/errors"
import { apiError } from "@/app/lib/errors/errors"
import { extractRequestSchema } from "@/app/lib/proto/schemas"
import { ExtractRequest } from "@/app/lib/proto/types"
import { FileType } from "@/app/lib/types"
import { isBase64FileType } from "@/app/lib/utils/utils"
import { extractFileText, extractStructuredData } from "./functions"

const ajv = new Ajv({
  strictKeywords: true,
})

/**
 * POST /api/extract - Extract text and structured data from a file
 * @param request The incoming request
 * @returns The response
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    // headers to be used for later
    request.headers.get(constants.requestIdHeader)
    request.headers.get(constants.userIdHeader)

    // Validate body
    let validationResult
    try {
      const body = await request.json()
      validationResult = extractRequestSchema.parse(body)
    } catch (error) {
      return apiError(errors.InvalidRequestBody, 400, error instanceof ZodError ? error : String(error))
    }

    const { document, jsonSchema, lastResponse } = ExtractRequest.fromJSON(validationResult)

    const fileType = Object.values(FileType).find((type) => isBase64FileType(document, type))

    if (!fileType) {
      return apiError(errors.InvalidDocument, 400)
    }

    const decodedOpenAPISpec = Buffer.from(jsonSchema, "base64")

    let jsonSchemaObj
    try {
      jsonSchemaObj = JSON.parse(decodedOpenAPISpec.toString())
    } catch (error) {
      return apiError(errors.InvalidJSONSchema, 400, String(error))
    }

    if (!ajv.validateSchema(jsonSchemaObj)) {
      return apiError(errors.InvalidJSONSchema, 400)
    }

    try {
      ajv.compile(jsonSchemaObj)
    } catch (error) {
      return apiError(errors.InvalidJSONSchema, 400, String(error))
    }

    const text = await extractFileText(document, fileType)
    const result = await extractStructuredData(text, jsonSchemaObj, lastResponse)

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.statusCode >= 500 && error.statusCode < 600) {
        console.error("internal server error", error)
      }
      return apiError(errors.InternalError, error.statusCode)
    }
    return apiError(errors.InternalError, 500, String(error))
  }
}
