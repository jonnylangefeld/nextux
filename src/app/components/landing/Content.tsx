import React from "react"

interface Props {
  children: React.ReactNode
  className?: string
}

export default function Section(props: Props) {
  return <div className={`flex flex-col gap-y-20 ${props.className ? props.className : ""}`}>{props.children}</div>
}
