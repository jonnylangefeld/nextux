"use client"

import { useEffect, useState } from "react"

interface Props {
  children: React.ReactNode
}

export default function Section(props: Props) {
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

  const [randomPolygon, setRandomPolygon] = useState(generatePolygon())

  useEffect(() => {
    const interval = setInterval(() => {
      setRandomPolygon(generatePolygon())
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-screen bg-white dark:bg-slate-900">
      <div className="relative isolate flex h-full items-center justify-center px-6 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu blur-3xl sm:-top-80" aria-hidden="true">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-50 transition-all duration-[10000ms] ease-background-polygon dark:opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath: randomPolygon,
            }}
          />
        </div>
        {props.children}
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-50 transition-all duration-[10000ms] ease-background-polygon dark:opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath: randomPolygon,
            }}
          />
        </div>
      </div>
    </div>
  )
}
