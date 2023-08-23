import Link from "next/link"
import React from "react"
import Section from "./Section"

export default function Footer() {
  return (
    <Section>
      <div className="flex h-28 w-full items-center justify-center">
        <p>
          Made by{" "}
          <Link href="https://x.com/jonnylangefeld" className="link" target="_blank">
            @jonnylangefeld
          </Link>
        </p>
      </div>
    </Section>
  )
}
