import React, { useState } from "react"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  frontLabel: string
  frontElement: JSX.Element
  backLabel: string
  backElement: JSX.Element
}

export default function RotatingCard(props: Props) {
  const [front, setFront] = useState<boolean>(true)

  return (
    <div className={`flex w-full flex-col items-center gap-y-7 ${props.className}`}>
      <div>
        <div className="flex min-w-[150px] flex-row justify-evenly gap-x-2 rounded-lg  bg-slate-800 p-3 py-2 text-center dark:bg-slate-950">
          <button
            onClick={() => setFront(true)}
            className={`btn-sm btn w-1/2 rounded-md p-2 py-1 dark:btn-neutral ${
              front ? "" : "border-none bg-inherit text-neutral-50 dark:border-none dark:bg-inherit"
            }`}
          >
            {props.frontLabel}
          </button>
          <button
            onClick={() => setFront(false)}
            className={`btn-sm btn w-1/2 rounded-md p-2 py-1 dark:btn-neutral ${
              !front ? "" : "border-none bg-inherit text-neutral-50 dark:border-none dark:bg-inherit"
            }`}
          >
            {props.backLabel}
          </button>
        </div>
      </div>
      <div className="w-full [perspective:3000px]">
        <div
          className="relative h-full w-full transition-all duration-500 will-change-transform [transform-style:preserve-3d]"
          style={{ transform: `rotateY(${front ? "0" : "-180"}deg)` }}
        >
          <div className="relative z-[1] w-full [backface-visibility:hidden] ">{props.frontElement}</div>
          <div
            className={`absolute right-0 top-0 h-full w-full ${
              front ? "z-[0]" : "z-[2]"
            } [backface-visibility:hidden] [transform:rotateY(180deg)]`}
          >
            {props.backElement}
          </div>
        </div>
      </div>
    </div>
  )
}
