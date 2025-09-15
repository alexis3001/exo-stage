"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/supabase/supabaseclient'

export default function FavoritesPage() {
  const [googleId, setGoogleId] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  // Récupère l'utilisateur connecté
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error("Erreur auth :", error)
        setMessage("Erreur lors de la récupération de l'utilisateur.")
      } else {
        setUser(data.user)
      }
      setLoading(false)
    }

    getUser()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setMessage("❌ Vous devez être connecté.")
      return
    }

    if (!googleId.trim()) {
      setMessage("❌ Le Google ID ne peut pas être vide.")
      return
    }

    const { error } = await supabase
      .from('favorites')
      .insert([{
        user_id: user.id,
        google_id: googleId,
        created_at: new Date().toISOString()
      }])

    if (error) {
      console.error("Erreur Supabase:", error)
      setMessage("❌ Erreur lors de l'ajout.")
    } else {
      setMessage("✅ Favori ajouté avec succès !")
      setGoogleId('')
    }
  }

  if (loading) return <p>Chargement...</p>

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: 'auto' }}>
      <h1>Ajouter un Favori</h1>

      {!user && (
        <p style={{ color: 'red' }}>⚠️ Vous devez être connecté pour ajouter un favori.</p>
      )}

      {user && (
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <input
            type="text"
            placeholder="Google ID"
            value={googleId}
            onChange={(e) => setGoogleId(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc"
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Ajouter
          </button>
        </form>
      )}

      {message && (
        <p style={{ marginTop: "1rem", color: message.startsWith("✅") ? "green" : "red" }}>
          {message}
        </p>
      )}
    </div>
  )
}

