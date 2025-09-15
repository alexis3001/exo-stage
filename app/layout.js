// app/layout.js
import './globals.css'
import React from 'react'

// Tu peux ajouter un provider ici plus tard (auth, theme, etc.)

export const metadata = {
  title: 'Mon App Supabase',
  description: 'App avec Next.js et Supabase',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <header style={{ padding: "1rem", background: "#eee" }}>
          <h1>Bienvenue dans mon app</h1>
        </header>
        <main style={{ padding: "2rem" }}>
          {children}
        </main>
      </body>
    </html>
  )
}
