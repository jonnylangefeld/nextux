import { initializeHypertune, Rec2 } from "@/app/lib/hypertune/flags"

const hypertune = initializeHypertune(
  {},
  {
    token: process.env.NEXT_PUBLIC_HYPERTUNE_TOKEN,
    loggingMode: "off",
    shouldInitializeFromServer: process.env.NODE_ENV !== "test",
    shouldStartIntervals: false,
    shouldListenForUpdates: true,
  }
)

export default hypertune

export const context: Rec2 = {
  context: {
    environment: process.env.NODE_ENV,
  },
}

/**
 * The Hypertune flags. Use this only on the server.
 * @returns The Hypertune flags
 */
export const flags = async () => {
  if (process.env.NODE_ENV !== "test") {
    await hypertune.initFromServerIfNeeded()
  }
  return hypertune.root(context)
}
