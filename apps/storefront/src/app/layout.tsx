import { themeInitScript } from "@lib/theme"
import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Archivo, IBM_Plex_Mono, Instrument_Sans } from "next/font/google"
import "styles/globals.css"

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
})

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
})

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${archivo.variable} ${instrumentSans.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
