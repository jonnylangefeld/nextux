import { initializeHypertune, Rec2 } from "@/app/lib/hypertune/flags"

const hypertune = initializeHypertune({}, { token: process.env.NEXT_PUBLIC_HYPERTUNE_TOKEN })

export default hypertune

export const context: Rec2 = {
  context: {
    environment: process.env.NODE_ENV,
  },
}

/**
 * The Hypertune flags. Use this only on the server.
 */
export const flags = async () => {
  await hypertune.initFromServerIfNeeded()
  return hypertune.root(context)
}
