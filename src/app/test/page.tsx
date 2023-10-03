import dynamic from "next/dynamic"

export default function Test() {
  const RecordButton = dynamic(() => import("../components/RecordButton"), { ssr: false })
  return <RecordButton />
}
