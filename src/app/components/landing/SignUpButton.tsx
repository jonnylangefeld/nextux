"use client"

import React from "react"
import Button from "@/app/components/Button"
import * as Toast from "@/app/components/Toast"

export default function SignUpButton() {
  return (
    <Button
      gradient
      onClick={() => {
        Toast.warning(["coming soon! ⏳"])
      }}
    >
      Sign Up
    </Button>
  )
}
