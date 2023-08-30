import React from "react"

export default function Section(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div id={props.id || ""} className={["mx-[10vw] flex items-center justify-center", props.className].join(" ")}>
      <div className="flex w-full max-w-7xl justify-center">{props.children}</div>
    </div>
  )
}
