import React from "react"
import Button from "@/app/components/Button"
import Highlight from "./Highlight"
import Section from "./Section"

export default function Hero() {
  return (
    <Section>
      <div className="flex h-screen items-center">
        <div className="max-w-lg text-center">
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
