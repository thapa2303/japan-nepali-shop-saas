import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { SiteChrome } from '@/components/layout/site-chrome'
import { CartProvider } from '@/lib/contexts/cart-context'
import { Toaster } from '@/components/ui/toaster'

const geist = Geist({ 
  subsets: ["latin"],
  variable: "--font-geist"
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-geist-mono"
})

export const metadata: Metadata = {
  title: 'ShopSaaS - Nepali Shops in Japan',
  description: 'Order from Nepali-owned shops across Japan. Browse groceries, food, fashion, handicrafts, and more from trusted Nepali vendors, delivered nationwide.',
  keywords: ['Nepali shops Japan', 'Nepali grocery Japan', 'Shin-Okubo', 'Tokyo', 'delivery', 'momo', 'Nepali food', 'diaspora'],
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#E07B39',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        <CartProvider>
          <SiteChrome>{children}</SiteChrome>
        </CartProvider>
        <Toaster />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
