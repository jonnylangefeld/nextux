"use client"

import { json, jsonParseLinter } from "@codemirror/lang-json"
import { linter, lintGutter } from "@codemirror/lint"
import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror"
import React, { useState } from "react"
import EventEmitter from "events"
import { wittyFormSchema } from "@/app/lib/rjsfSchemas"
import Frame from "./Frame"
import MagicForm from "./MagicForm"
import RotatingCard from "./RotatingCard"
import Confetti from "../Confetti"

const submitEventEmitter = new EventEmitter()

export default function Demo() {
  const [jsonSchema, setJSONSchema] = useState(JSON.stringify(wittyFormSchema, null, 2))
  const [lintErrors, setLintErrors] = useState(false)
  const onChange = React.useCallback((val: string, _: ViewUpdate) => {
    try {
      JSON.parse(val)
      setLintErrors(false)
      setJSONSchema(val)
    } catch (e) {
      setLintErrors(true)
    }
  }, [])
  return (
    <>
      <Confetti numberOfPieces={150} eventEmitter={submitEventEmitter} />
      <RotatingCard
        frontLabel="Try"
        backLabel="Edit"
        frontElement={
          <Frame>
            <MagicForm schema={JSON.parse(jsonSchema)} submitEventEmitter={submitEventEmitter} />
          </Frame>
        }
        backElement={
          <div className="flex h-full flex-col rounded-lg bg-slate-800 text-slate-200 dark:bg-slate-950">
            <div className="relative m-3 text-sm">
              <p>
                The{" "}
                <a className="link" href="https://json-schema.org/understanding-json-schema/">
                  JSON Schema
                </a>{" "}
                below renders the form on the front.
              </p>
              <p>Edit it to update the form in real time and extract any data you want!</p>
              <div
                className={`badge badge-error pointer-events-none absolute right-0 top-0 duration-200 ${
                  lintErrors ? "opacity-100" : "opacity-0"
                }`}
              >
                Fix the errors below
              </div>
            </div>
            <CodeMirror
              className="flex-grow overflow-clip"
              height="100%"
              value={jsonSchema}
              extensions={[json(), linter(jsonParseLinter(), { delay: 0 }), lintGutter()]}
              onChange={onChange}
              theme="dark"
            />
          </div>
        }
      />
    </>
  )
}
