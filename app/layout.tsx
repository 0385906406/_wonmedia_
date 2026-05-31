import type { Metadata } from "next"
import { Be_Vietnam_Pro, Space_Grotesk, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["vietnamese", "latin"],
  variable: "--font-primary",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--nic-font-mono-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--nic-font-monospace",
  display: "swap",
})

export const metadata: Metadata = {
  title: "WonMedia Portal",
  description: "Giải pháp viễn thông toàn diện, tốc độ cao và ổn định.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full`}
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
