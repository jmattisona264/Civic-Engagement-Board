import "./globals.css"; 

export const metadata = {
  title: 'Community Pulse',
  description: 'Your localized community portal',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}