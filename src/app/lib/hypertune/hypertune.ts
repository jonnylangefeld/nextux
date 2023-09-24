import { initializeHypertune } from "@/app/lib/hypertune/flags"

const hypertune = initializeHypertune({}, { token: process.env.NEXT_PUBLIC_HYPERTUNE_TOKEN })

export default hypertune
