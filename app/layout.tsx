import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Open_Sans } from "next/font/google"
import Script from "next/script"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "Sistema de Gestión - Papelería",
  description: "Sistema completo de gestión para papelería",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${montserrat.variable} ${openSans.variable} antialiased`}>
      <head>
        <Script
          src="https://cdn.userway.org/widget.js"
          data-account="ZxtWFmmL7x"
          data-position="3"
          strategy="afterInteractive"
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
