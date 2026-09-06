import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ferdinand Estoque | Web Design & Development',
  description:
    'Hi, I am Ferdinand Belleza Estoque a.k.a. Black Raven, I design and build functional websites and this is my website projects.',
  keywords:
    'Ferdinand Estoque, Ferdinand Belleza Estoque, Estoque, Black Raven Estoque, Raven Estoque, Ravenom',
  authors: [{ name: 'Ferdinand Estoque' }],
  icons: {
    icon: '/assets/img/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Raleway:wght@900&family=Oswald:wght@300&family=Lato:wght@300;400;700;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </head>
      <body id="s2k">
        {children}
        <Script src="/assets/js/main.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}