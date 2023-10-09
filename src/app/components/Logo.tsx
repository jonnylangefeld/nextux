import Link from "next/link"
import React from "react"

interface Props {
  className?: string
}

export default function Logo({ className }: Props) {
  return (
    <div className={`relative ${className}`}>
      <object
        type="image/svg+xml"
        title="nextux Logo"
        data="/logo.svg"
        className="absolute inset-0 h-full w-full"
        role="img"
        style={{
          colorScheme: "normal",
        }}
      ></object>
      <Link href="/" className="absolute inset-0" />
    </div>
  )
}
