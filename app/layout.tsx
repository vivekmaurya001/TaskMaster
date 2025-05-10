import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TaskMaster',
  description: 'Job scheduler for periodic and non-periodic jobs',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
