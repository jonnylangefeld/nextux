"use client"

import { useEffect, useState } from "react"

export default function Section() {
  const generatePolygon = () => {
    let path = ""
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * 100
      const y = Math.random() * 100
      path += `${x.toFixed(1)}% ${y.toFixed(1)}%, `
    }
    path = path.slice(0, -2)
    return "polygon(" + path + ")"
  }

  const [topPolygon, setTopPolygon] = useState(generatePolygon())
  const [bottomPolygon, setBottomPolygon] = useState(generatePolygon())

  useEffect(() => {
    const interval = setInterval(() => {
      setTopPolygon(generatePolygon())
      setBottomPolygon(generatePolygon())
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed -z-50 h-screen w-screen bg-white dark:bg-slate-900">
      <div className="absolute top-0 transform-gpu overflow-hidden blur-3xl">
        <div
          className="relative left-[-15vw] h-[66vh] w-[130vw] -translate-x-1/3 -translate-y-1/3 -rotate-45 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-50 transition-all duration-[10000ms] ease-background-polygon dark:opacity-30"
          style={{
            clipPath: topPolygon,
          }}
        />
      </div>
      <div className="absolute bottom-0 transform-gpu overflow-hidden blur-3xl">
        <div
          className="relative left-[-15vw] h-[66vh] w-[130vw] translate-x-1/3 translate-y-1/3 -rotate-45 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-50 transition-all duration-[10000ms] ease-background-polygon dark:opacity-30"
          style={{
            clipPath: bottomPolygon,
          }}
        />
      </div>
    </div>
  )
}
