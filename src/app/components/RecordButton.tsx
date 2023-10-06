"use client"

import AudioRecorder from "audio-recorder-polyfill"
import mpegEncoder from "audio-recorder-polyfill/mpeg-encoder"
import React from "react"
import Button from "../components/Button"
import { ExtractRequest } from "../lib/proto/types"
import { contactFormSchema } from "../lib/rjsfSchemas"

AudioRecorder.encoder = mpegEncoder
AudioRecorder.prototype.mimeType = "audio/mpeg"
window.MediaRecorder = AudioRecorder

export default function RecordButton() {
  const [recording, setRecording] = React.useState(false)
  const [recorder, setRecorder] = React.useState<MediaRecorder | null>(null)

  const onClick = async () => {
    if (recording) {
      setRecording(false)
      recorder?.stop()
      recorder?.stream.getTracks().forEach((i) => i.stop())
    }
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(async (stream) => {
        const recorder = new MediaRecorder(stream)
        setRecorder(recorder)

        recorder.addEventListener("dataavailable", (event) => {
          console.log(event.data)

          if (event.data.size > 0) {
            const reader = new FileReader()

            reader.onloadend = async function () {
              if (reader.result) {
                const base64Audio = (reader.result as string).split(",")[1] // Splitting to get only the Base64 data

                const body: ExtractRequest = {
                  jsonSchema: Buffer.from(JSON.stringify(contactFormSchema)).toString("base64"),
                  document: base64Audio,
                }

                console.log(body)
                const resp = await fetch("/api/extract", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(body),
                })
              }
            }

            reader.readAsDataURL(event.data)
          }
        })

        recorder.start()
        setRecording(true)
      })
      .catch(function (error) {
        console.error("Media device access denied:", error)
      })
  }
  return <Button onClick={onClick}>Click me</Button>
}
