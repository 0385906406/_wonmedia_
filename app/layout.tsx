import type { Metadata } from "next"
import { Be_Vietnam_Pro, Space_Grotesk, JetBrains_Mono, Source_Serif_4 } from "next/font/google"
import "./globals.css"
import { connectDB } from "@/lib/mongodb"
import Setting from "@/models/Setting"

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["vietnamese", "latin"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

const sourceSerif = Source_Serif_4({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
})

export async function generateMetadata(): Promise<Metadata> {
  const base = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wonmedia.vn')
  try {
    await connectDB()
    const s = await Setting.findOne({ key: 'global' }).lean() as {
      general?: { portalName?: string; tagline?: string }
      header?: { faviconUrl?: string }
    } | null
    const title       = s?.general?.portalName || 'WonMedia Portal'
    const description = s?.general?.tagline    || 'Giải pháp viễn thông toàn diện, tốc độ cao và ổn định.'
    const faviconUrl  = s?.header?.faviconUrl  || '/favicon.ico'
    return {
      metadataBase: base,
      title,
      description,
      icons: { icon: faviconUrl, shortcut: faviconUrl },
    }
  } catch {
    return {
      metadataBase: base,
      title: 'WonMedia Portal',
      description: 'Giải pháp viễn thông toàn diện, tốc độ cao và ổn định.',
    }
  }
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${sourceSerif.variable} h-full`}
    >
      <body
        className="min-h-full flex flex-col antialiased"
        style={{ fontFamily: "var(--font-primary), system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  )
}
