import React, { useEffect, useMemo } from "react"
import hypertune, { context } from "./hypertune"

/**
 * A React hook that returns the Hypertune root node initialized with the context
 * @returns The Hypertune root node
 */
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
  return useMemo(() => hypertune.root(context), [])
}
