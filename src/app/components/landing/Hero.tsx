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

  useEffect(() => {
    let max = 0
    const handleScroll = () => {
      const screenBottom = screenRef.current?.getBoundingClientRect().bottom || 0
      const contentBottom = contentRef.current?.getBoundingClientRect().bottom || 0
      if (screenBottom >= max) {
        setItems("fixed items-center")
        setTranslate("")
      }
      if (screenBottom - 160 < contentBottom) {
        max = Math.max(max, screenBottom)
        setItems("absolute items-end")
        setTranslate("translate-y-[-10rem]")
      }
    }
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
            <a href="/docs/quick-start" target="_blank">
              <Button gradient className="btn">
                Get Started 🚀
              </Button>
            </a>
          </div>
        </div>
      </div>
    </Section>
  )
}
