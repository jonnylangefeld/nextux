import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "nextUX",
  description: "Make human input more natural",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-gray-900 last:overflow-hidden dark:text-gray-200`}>{children}</body>
    </html>
  )
}
