import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "nextUX",
  description: "Make human input more natural",
  content: "Make human input more natural",
  icons: {
    icon: { url: "/favicon.svg", type: "image/svg" },
    shortcut: { url: "/favicon.svg", type: "image/svg" },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ffffff" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        <meta property="og:title" content="nextUX" />
        <meta property="og:description" content="Make human input more natural" />
        <meta property="og:url" content="https://nextux.ai" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="nextUX" />
        <meta property="og:type" content="website" />
      </head>
      <body className={`${inter.className} text-gray-900 last:overflow-hidden dark:text-gray-200`}>{children}</body>
    </html>
  )
}
