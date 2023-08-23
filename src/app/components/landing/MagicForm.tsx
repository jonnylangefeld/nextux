"use client"

import { withTheme } from "@rjsf/core"
import { RJSFSchema } from "@rjsf/utils"
import validator from "@rjsf/validator-ajv8"
import daisyUI from "../themes/rjsf/daisyUI"

const ThemedForm = withTheme(daisyUI)

const schema: RJSFSchema = {
  title: "Todo",
  type: "object",
  required: ["foo"],
  properties: {
    foo: {
      type: "string",
      title: "Foo",
      default: "A new taskA new taskA new taskA new taskA new taskA new task",
    },
    bar: { type: "string", title: "Bar", default: "A new task" },
    foobar: {
      type: "object",
      properties: {
        a: {
          type: "string",
          description: "A description",
          title: "A",
        },
        b: {
          type: "string",
        },
      },
    },
    done: { type: "boolean", title: "Done?", default: false },
  },
}

export default function MagicForm() {
  return (
    <ThemedForm schema={schema} validator={validator} className="form-control w-full max-w-xl gap-y-2"></ThemedForm>
  )
}
