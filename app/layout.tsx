import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Fortuna — Automated Trading",
  description: "AI-powered trading bot for WEEX exchange",
  icons: { icon: "/logo.svg", apple: "/logo.svg" },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Fortuna",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
