"use client"

import { useRive, useStateMachineInput } from "@rive-app/react-canvas"
import { RJSFSchema } from "@rjsf/utils"
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import * as Toast from "@/app/components/Toast"
import useHypertune from "@/app/lib/hypertune/useHypertune"
import { ExtractRequest } from "@/app/lib/proto/types"

const webmSupported = typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported("audio/webm")

if (!webmSupported) {
  // Dynamically import the polyfill if 'audio/webm' is not supported
  Promise.all([import("audio-recorder-polyfill"), import("audio-recorder-polyfill/mpeg-encoder")])
    .then(([AudioRecorderModule, mpegEncoderModule]) => {
      const AudioRecorder = AudioRecorderModule.default
      const mpegEncoder = mpegEncoderModule.default

      AudioRecorder.encoder = mpegEncoder
      AudioRecorder.prototype.mimeType = "audio/mpeg"
      window.MediaRecorder = AudioRecorder
    })
    .catch((error) => {
      console.error("Error importing polyfill:", error)
    })
}

const initialToolTipMessages = ["Click the FormButler icon to help you fill out this form", "Try it out!"]
const tooltipDuration = 5000

type recording = "stopped" | "started"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  setFormData: Dispatch<SetStateAction<object>>
  formData: object
  schema: RJSFSchema
  tooltipRef: React.RefObject<HTMLDivElement>
}

export default function RecordingButton(props: Props) {
  const recordingRef = useRef<recording>("stopped")
  const frameRef: React.RefObject<HTMLDivElement> = useRef(null)
  const [pulse, setPulse] = useState(true)
  const [tooltipText, setTooltipText] = useState(initialToolTipMessages[0])
  const [tooltipMessages, setTooltipMessages] = useState<string[]>(initialToolTipMessages)
  const [tooltipCycler, setTooltipCycler] = useState<NodeJS.Timer | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const { rive, RiveComponent } = useRive({
    src: "/formbutler.riv",
    stateMachines: "recording",
    autoplay: true,
  })
  const animateStart = useStateMachineInput(rive, "recording", "start")
  const animateStop = useStateMachineInput(rive, "recording", "stop")
  const animateUploaded = useStateMachineInput(rive, "recording", "uploaded")
  const animateCenter = useStateMachineInput(rive, "recording", "center")
  const animateLeft = useStateMachineInput(rive, "recording", "left")
  const animateRight = useStateMachineInput(rive, "recording", "right")
  const skipExpensiveAPICalls = useHypertune().skipExpensiveAPICalls().get(false)

  const setDisableRecordingButton = (disabled: boolean) => {
    if (disabled) {
      frameRef.current?.classList.add("pointer-events-none")
    } else {
      frameRef.current?.classList.remove("pointer-events-none")
    }
  }

  const setTooltipOpen = (open: boolean) => {
    if (open) {
      props.tooltipRef.current?.classList.add("tooltip-open")
    } else {
      props.tooltipRef.current?.classList.remove("tooltip-open")
    }
  }

  const apiRequest = async (body: ExtractRequest) => {
    const resp = await fetch("/api/extract", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    if (skipExpensiveAPICalls) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      Toast.info(["Dev mode: API call skipped"])
    }
    const json = await resp.json()
    if (resp.status >= 500) {
      Toast.error([json.error])
      return
    }
    if (resp.status >= 400) {
      Toast.warning([json.error])
      return
    }
    props.setFormData(json)
    recordingRef.current = "stopped"
  }

  const animateFrequencies = (analyser: AnalyserNode) => {
    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    return setInterval(() => {
      analyser.getByteFrequencyData(dataArray)

      const maxRelevantIndex = 55
      const segmentSize = Math.floor(maxRelevantIndex / 3)

      const segments = [
        dataArray.slice(0, segmentSize),
        dataArray.slice(segmentSize, 2 * segmentSize),
        dataArray.slice(2 * segmentSize, maxRelevantIndex),
      ]

      const barValues = segments.map((segment) => {
        // Get the max value for each segment
        const max = Math.max(...Array.from(segment))
        // Normalize the value to be between 0 and 100
        return (max / 255) * 100
      })

      const center = barValues[0]
      const left = barValues[1]
      const right = barValues[2]

      if (animateCenter) {
        animateCenter.value = center
      }
      if (animateLeft) {
        animateLeft.value = left
      }
      if (animateRight) {
        animateRight.value = right
      }
    }, 50)
  }

  const cycleTooltips = (messages: string[]) => {
    let i = 0
    const intervalId = setInterval(() => {
      setTooltipText(messages[i])
      i = (i + 1) % messages.length
    }, tooltipDuration)
    return intervalId
  }

  const addStopEvents = (mediaRecorder: MediaRecorder, animateFrequenciesInterval: NodeJS.Timer) => {
    mediaRecorder.addEventListener("stop", () => {
      clearInterval(animateFrequenciesInterval)
      setTooltipOpen(false)
      if (tooltipCycler) {
        clearInterval(tooltipCycler)
      }
    })

    mediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) {
        animateStop?.fire()
        const reader = new FileReader()

        reader.onloadend = async function () {
          if (reader.result) {
            const base64Audio = (reader.result as string).split(",")[1] // Splitting to get only the Base64 data

            const body: ExtractRequest = {
              jsonSchema: Buffer.from(JSON.stringify(props.schema)).toString("base64"),
              document: base64Audio,
            }
            if (Object.keys(props.formData).length > 0) {
              body.lastResponse = JSON.stringify(props.formData)
            }

            await apiRequest(body)

            animateUploaded?.fire()
            setTooltipOpen(true)
            const newMessages = [
              "You can click again for a new recording to correct yourself or the butler",
              "You only need to give it the new information",
              ...initialToolTipMessages,
            ]
            setTooltipText(newMessages[0])
            setTooltipMessages(newMessages)
            setDisableRecordingButton(false)
          }
        }

        reader.readAsDataURL(event.data)
      }
    })
  }

  const startRecording = (mediaRecorder: MediaRecorder) => {
    mediaRecorder.start()
    setMediaRecorder(mediaRecorder)
    recordingRef.current = "started"
    animateStart?.fire()
    setPulse(false)
    if (tooltipCycler) {
      clearInterval(tooltipCycler)
    }
    // We show this tooltip only when the user clicks the button
    setTooltipText("Start speaking to fill out this form")
    // After that we cycle through the following messages
    setTooltipMessages([
      "You can talk like you normally would with a friend or colleague",
      "It helps to spell out names like you would in a phone call",
      "You can say things like 'my name is Peter, that's P-E-T-E-R'",
      "Click the FormButler icon again to stop recording",
    ])
  }

  const stopRecording = (mediaRecorder: MediaRecorder) => {
    // Stop all tracks to ensure that the microphone is released
    mediaRecorder.stop()
    mediaRecorder.stream.getTracks().forEach((track) => track.stop())
  }

  const handleStream = async (streamPromise: Promise<MediaStream>) => {
    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 256 // Reducing FFT size for quicker analysis
    analyser.smoothingTimeConstant = 0.1

    // Request permission and start recording once the the button is clicked
    streamPromise
      .then((stream) => {
        setTooltipOpen(true)
        const newMediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" })

        const source = audioContext.createMediaStreamSource(stream)
        source.connect(analyser)

        // Check amplitude periodically
        const animateFrequenciesInterval = animateFrequencies(analyser)

        addStopEvents(newMediaRecorder, animateFrequenciesInterval)

        startRecording(newMediaRecorder)
      })
      .catch(() => {
        Toast.error(["Permission to use microphone not given.", "Click 'Reset permission' in your browser settings."])
      })
      // adding this timeout fixed a bug in safari where it always takes a while
      // for the microphone to start listening. During that time button clicks were queue by the browser even despite
      // the class `pointer-events-none`. The click events were processed only once the stream was available, which
      // was the immediately after the `pointer-events-none` class was removed.
      // This timeout makes sure that these queued up button clicks during the microphone activation don't get counted.
      .finally(() => setTimeout(() => setDisableRecordingButton(false), 500))
  }

  const handleRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      Toast.error(["WebRTC not supported"])
      return
    }

    setDisableRecordingButton(true)

    if (recordingRef.current === "started" && mediaRecorder) {
      stopRecording(mediaRecorder)
      return
    }

    setTooltipOpen(false)
    setTimeout(async () => {
      await handleStream(navigator.mediaDevices.getUserMedia({ audio: true }))
    }, 0)
  }

  useEffect(() => {
    const intervalId = cycleTooltips(tooltipMessages)
    setTooltipCycler(intervalId)

    // Cleanup the interval on unmount
    return () => {
      clearInterval(intervalId)
    }
  }, [tooltipMessages])

  return (
    <div
      ref={props.tooltipRef}
      className={`light:before:shadow-[0px_0px_28px_0px_#fff] tooltip-open tooltip before:max-w-[10rem] before:content-[attr(data-tip)] md:before:max-w-[20rem] ${
        props.className || ""
      }`}
      data-tip={tooltipText}
    >
      <div className="relative aspect-square w-[2.5rem] cursor-pointer" onClick={handleRecording} ref={frameRef}>
        <div
          className={`absolute -z-20 h-full w-full scale-100 ${
            pulse ? "animate-pulse" : ""
          } rounded-md bg-white blur-lg`}
        />
        <RiveComponent />
      </div>
    </div>
  )
}
