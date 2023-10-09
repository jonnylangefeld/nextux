/* eslint-disable */
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "";

/** ExtractRequest is the body sent to the /extract endpoint */
export interface ExtractRequest {
  /**
   * document contains a base64 encoded string of a document like PDF or png
   *
   * @minLength 1
   */
  document: string;
  /**
   * jsonSchema is a json schema object as a base64 encoded string as defined by https://json-schema.org/understanding-json-schema/
   *
   * @minLength 1
   */
  jsonSchema: string;
  /** lastResponse contains the stringified version of an openAPI schema of a previous response. The openAI call will take it into consideration and merge it with the new data */
  lastResponse?: string | undefined;
}

function createBaseExtractRequest(): ExtractRequest {
  return { document: "", jsonSchema: "", lastResponse: undefined };
}

export const ExtractRequest = {
  encode(message: ExtractRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.document !== "") {
      writer.uint32(10).string(message.document);
    }
    if (message.jsonSchema !== "") {
      writer.uint32(18).string(message.jsonSchema);
    }
    if (message.lastResponse !== undefined) {
      writer.uint32(26).string(message.lastResponse);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ExtractRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExtractRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.document = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.jsonSchema = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.lastResponse = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ExtractRequest {
    return {
      document: isSet(object.document) ? String(object.document) : "",
      jsonSchema: isSet(object.jsonSchema) ? String(object.jsonSchema) : "",
      lastResponse: isSet(object.lastResponse) ? String(object.lastResponse) : undefined,
    };
  },

  toJSON(message: ExtractRequest): unknown {
    const obj: any = {};
    if (message.document !== "") {
      obj.document = message.document;
    }
    if (message.jsonSchema !== "") {
      obj.jsonSchema = message.jsonSchema;
    }
    if (message.lastResponse !== undefined) {
      obj.lastResponse = message.lastResponse;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ExtractRequest>, I>>(base?: I): ExtractRequest {
    return ExtractRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ExtractRequest>, I>>(object: I): ExtractRequest {
    const message = createBaseExtractRequest();
    message.document = object.document ?? "";
    message.jsonSchema = object.jsonSchema ?? "";
    message.lastResponse = object.lastResponse ?? undefined;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
