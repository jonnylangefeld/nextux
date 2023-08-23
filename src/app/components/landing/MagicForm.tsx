"use client"

import Form from "@rjsf/core"
import { getDefaultRegistry } from "@rjsf/core"
import { FieldTemplateProps, ObjectFieldTemplateProps, RJSFSchema, TitleFieldProps, WidgetProps } from "@rjsf/utils"
import { BaseInputTemplateProps } from "@rjsf/utils"
import validator from "@rjsf/validator-ajv8"

const { templates } = getDefaultRegistry()

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
    done: { type: "boolean", title: "Done?", default: false },
  },
}

export default function MagicForm() {
  return (
    <Form
      schema={schema}
      validator={validator}
      className="form-control w-full max-w-xl gap-y-2"
      templates={{
        BaseInputTemplate: (props: BaseInputTemplateProps) => (
          <templates.BaseInputTemplate className="input-bordered input w-full" {...props} />
        ),
        FieldTemplate: (props: FieldTemplateProps) => (
          <div className="flex flex-row items-center gap-x-3" style={props.style}>
            {props.displayLabel && (
              <label className="label label-text" htmlFor={props.id}>
                {props.label}
                {props.required ? "*" : null}
              </label>
            )}
            {props.description}
            {props.children}
            {props.errors}
            {props.help}
          </div>
        ),
        ObjectFieldTemplate: (props: ObjectFieldTemplateProps) => (
          <div className="flex w-full flex-col gap-y-2">
            <div className="mb-3 text-2xl">{props.title}</div>
            {props.description}
            {props.properties.map((element) => element.content)}
          </div>
        ),
        TitleFieldTemplate: (props: TitleFieldProps) => {
          return (
            <p className="mb-3 text-2xl" id={props.id}>
              {props.title}
              {props.required && <mark>?</mark>}
            </p>
          )
        },
      }}
      widgets={{
        CheckboxWidget: (props: WidgetProps) => {
          return (
            <label className="label flex cursor-pointer flex-row gap-x-3">
              <p className="label-text">{props.label}</p>
              <input
                type="checkbox"
                checked={props.value}
                className="checkbox"
                onChange={() => props.onChange(!props.value)}
              />
            </label>
          )
        },
      }}
    ></Form>
  )
}
