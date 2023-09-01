"use client"

import React, { useEffect, useRef, useState } from "react"
import Button from "@/app/components/Button"
import Highlight from "./Highlight"
import Section from "./Section"

export default function Hero() {
  const [items, setItems] = useState("fixed items-center")
  const [translate, setTranslate] = useState("")
  const screenRef: React.RefObject<HTMLDivElement> = useRef(null)
  const contentRef: React.RefObject<HTMLDivElement> = useRef(null)

  const updateClasses = (threshold: number) => {
    const screenBottom = screenRef.current?.getBoundingClientRect().bottom || 0
    if (screenBottom >= threshold) {
      setItems("fixed items-center")
      setTranslate("")
    }
    if (screenBottom - 160 < threshold) {
      // 160 is 10rem
      setItems("absolute items-end")
      setTranslate("translate-y-[-10rem]")
    }
  }

  useEffect(() => {
    const threshold = contentRef.current?.getBoundingClientRect().bottom || 0
    updateClasses(threshold)
    const handleScroll = () => updateClasses(threshold)
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <Section>
      <div className="h-screen" ref={screenRef} />
      <div className={`flex h-screen ${items}`}>
        <div className={`max-w-lg ${translate} text-center`} ref={contentRef}>
          <div className="xs:text-5xl text-4xl font-bold tracking-tight sm:text-6xl">
            Make <Highlight>human</Highlight> input more <Highlight>natural</Highlight>
          </div>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {/* <a href="/" target="_blank"> */}
            <Button gradient className="btn">
              Get Started 🚀
            </Button>
            {/* </a> */}
          </div>
        </div>
      </div>
    </Section>
  )
}
