import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google"
import { Analytics } from '@vercel/analytics/next'
import "./globals.css"
import { cn } from "@/lib/utils"
import { V0Provider } from "@/lib/context"
import dynamic from "next/dynamic"
import { TreasurePreloader } from "@/components/treasure/treasure-preloader"

const V0Setup = dynamic(() => import("@/components/v0-setup"))

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
})

const isV0 = process.env["VERCEL_URL"]?.includes("vusercontent.net") ?? false

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://trove.app'),
  title: {
    template: "%s | Trove",
    default: "Trove - Power Your Point",
  },
  description:
    "Ideas die on blank slides. Trove transforms brilliant thoughts into brilliant slides instantly. Skip the blank slide and speak in visuals with curated prompts that power your presentations.",
  keywords: [
    "presentations",
    "slides",
    "powerpoint",
    "visual communication",
    "presentation design",
    "slide templates",
    "presentation prompts",
    "trove",
  ],
  authors: [{ name: "Trove" }],
  creator: "Trove",
  publisher: "Trove",
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/logo.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Trove',
    title: 'Trove - Power Your Point',
    description:
      'Ideas die on blank slides. Trove transforms brilliant thoughts into brilliant slides instantly. Skip the blank slide and speak in visuals with curated prompts that power your presentations.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Trove - Power Your Point',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trove - Power Your Point',
    description:
      'Ideas die on blank slides. Trove transforms brilliant thoughts into brilliant slides instantly.',
    images: ['/og-image.jpg'],
    creator: '@trove',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn(geistSans.variable, geistMono.variable, instrumentSerif.variable, "font-sans antialiased")}>
        <V0Provider isV0={isV0}>
          <TreasurePreloader />
          {children}
          {isV0 && <V0Setup />}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </V0Provider>
      </body>
    </html>
  )
}
