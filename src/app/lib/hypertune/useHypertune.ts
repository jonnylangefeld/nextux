import React, { useEffect, useMemo } from "react"
import hypertune from "./hypertune"

export default function useHypertune() {
  // Trigger a re-render when flags are updated
  const [, setCommitHash] = React.useState<string | null>(hypertune.getCommitHash())
  useEffect(() => {
    hypertune.addUpdateListener(setCommitHash)
    return () => {
      hypertune.removeUpdateListener(setCommitHash)
    }
  }, [])

  // Return the Hypertune root node initialized with the context
  return useMemo(
    () =>
      hypertune.root({
        context: {
          environment: process.env.NODE_ENV,
        },
      }),
    []
  )
}
