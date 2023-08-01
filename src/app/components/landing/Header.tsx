import React from "react"
import Button from "@/app/components/Button"

export default function Header() {
  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-50 bg-clip-padding backdrop-blur-md backdrop-filter transition-all duration-200"
      }
    >
      <nav className="flex items-center justify-between space-x-4 p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">nextUX</div>

        <div className="xs:space-x-2 flex flex-1 items-center justify-end space-x-4">
          <Button gradient>Sign Up</Button>
        </div>
      </nav>
    </header>
  )
}
