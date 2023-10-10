"use client"

import React, { useEffect, useState } from "react"
import ReactConfetti from "react-confetti"
import { EventEmitter } from "events"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  numberOfPieces: number
  eventEmitter: EventEmitter
}

export default function Confetti(props: Props) {
  const [numberOfPieces, setNumberOfPieces] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0, w: 0, h: 0, scrollY: 0 })

  useEffect(() => {
    const fire = (e: HTMLElement) => {
      const target = e.getBoundingClientRect()
      setPosition({ x: target.x, y: target.y, w: target.width, h: target.height, scrollY: window.scrollY })
      setNumberOfPieces(props.numberOfPieces)
    }

    props.eventEmitter.on("fire", fire)

    return () => {
      props.eventEmitter.removeListener("fire", fire)
    }
  }, [props.eventEmitter, props.numberOfPieces])

  return (
    <ReactConfetti
      numberOfPieces={numberOfPieces}
      confettiSource={{ x: position.x, y: position.y, w: position.w, h: position.h }}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{ transform: `translateY(${position.scrollY}px)` }}
      recycle={false}
      wind={0.05}
      gravity={0.18}
      initialVelocityX={{ min: 0, max: 8 }}
      initialVelocityY={20}
      onConfettiComplete={(confetti) => {
        setNumberOfPieces(0)
        confetti?.reset()
      }}
    />
  )
}
