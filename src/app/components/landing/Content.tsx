import React from "react"

export default function Content(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex flex-col gap-y-20 ${props.className ? props.className : ""}`}>{props.children}</div>
}
