"use client"

import { useRive, useStateMachineInput } from "@rive-app/react-canvas"
import { RJSFSchema } from "@rjsf/utils"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
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

interface Props {
  setFormData: Dispatch<SetStateAction<object>>
  schema: RJSFSchema
}

export default function RecordingButton(props: Props) {
  const [recording, setRecording] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(true)
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

  const apiRequest = async (body: ExtractRequest) => {
    const resp = await fetch("/api/extract", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    const json = await resp.json()

    props.setFormData(json)
    if (skipExpensiveAPICalls) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      Toast.info(["Dev mode: API call skipped"])
    }
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

            await apiRequest(body)

            animateUploaded?.fire()
            setTooltipOpen(true)
            setTooltipText(initialToolTipMessages[0])
            setTooltipMessages(initialToolTipMessages)
          }
        }

        reader.readAsDataURL(event.data)
      }
    })
  }

  const startRecording = (mediaRecorder: MediaRecorder) => {
    mediaRecorder.start()
    setMediaRecorder(mediaRecorder)
    setRecording(true)
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
    setRecording(false)
  }

  const handleRecording = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      Toast.error(["WebRTC not supported"])
      return
    }

    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 256 // Reducing FFT size for quicker analysis
    analyser.smoothingTimeConstant = 0.1

    if (recording && mediaRecorder) {
      stopRecording(mediaRecorder)
    } else {
      // Request permission and start recording once the the button is clicked
      setTooltipOpen(false)
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          setTooltipOpen(true)
          const newMediaRecorder = new MediaRecorder(stream)

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
    }
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
      className={`${
        tooltipOpen ? "tooltip-open" : ""
      } light:before:shadow-[0px_0px_28px_0px_#fff] tooltip tooltip-bottom md:tooltip-top before:max-w-[10rem] before:translate-x-[-90%] before:content-[attr(data-tip)] md:before:max-w-[20rem] lg:before:translate-x-[-50%]`}
      data-tip={tooltipText}
    >
      <div className="relative aspect-square w-[2.5rem] cursor-pointer" onClick={handleRecording}>
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
