"use client"

import React, { useEffect, useRef, useState } from "react"
import { CaretDoubleDown } from "@/app/components/Icons"
import Highlight from "./Highlight"
import Section from "./Section"
import WaitList from "./WaitList"

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
    if (screenBottom - 176 < threshold) {
      // this has to match the margin of the Demo.tsx section
      setItems("absolute items-end")
      setTranslate("translate-y-[-11rem]")
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

  const handleDemoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    window.scrollTo({ behavior: "smooth", top: window.innerHeight - 200 })
  }

  return (
    <Section>
      <div className="h-[100svh]" ref={screenRef} />
      <div className={`flex h-screen w-fit ${items}`}>
        <div
          className={`flex max-w-lg flex-col ${translate} items-center justify-center gap-y-10 text-center`}
          ref={contentRef}
        >
          <div className="xs:text-5xl text-4xl font-bold tracking-tight sm:text-6xl">
            Make <Highlight>human</Highlight> input more <Highlight>natural</Highlight>
          </div>
          <WaitList />
          <a href="#demo" onClick={handleDemoClick}>
            <div className="flex cursor-pointer flex-nowrap items-center gap-x-2 rounded-full bg-gradient-to-br from-slate-800 to-slate-600 p-3 px-4 py-2 text-slate-200 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] dark:from-slate-950 dark:to-slate-800">
              <p>Try the demo</p>
              <CaretDoubleDown className="animate-bounce align-baseline" size={16} weight="bold" />
            </div>
          </a>
        </div>
      </div>
    </Section>
  )
}
