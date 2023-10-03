"use client"

import React from "react"
import RecordRTC from "recordrtc"
import Button from "../components/Button"
import { ExtractRequest } from "../lib/proto/types"
import { contactFormSchema } from "../lib/rjsfSchemas"

export default function RecordButton() {
  const onClick = async () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(async (stream) => {
        const recorder = new RecordRTC.StereoAudioRecorder(stream.clone(), {
          type: "audio",
          mimeType: "audio/webm;codecs=pcm",
          numberOfAudioChannels: 1,
        })
        recorder.record()

        // sleep 5 seconds
        await new Promise((r) => setTimeout(r, 5000))

        recorder.stop(function (data) {
          console.log(data)
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

          reader.readAsDataURL(data)
          // You can now use the blob, e.g., save it, upload it, etc.
        })
      })
      .catch(function (error) {
        console.error("Media device access denied:", error)
      })
  }
  return <Button onClick={onClick}>Click me</Button>
}
