import React from "react"

interface Props {
  children: React.ReactNode
  className?: string
}

export default function Section(props: Props) {
  return (
    <div className={`mx-[10vw] flex items-center justify-center ${props.className ? props.className : ""}`}>
      <div className="flex w-full max-w-7xl justify-center">{props.children}</div>
    </div>
  )
}
