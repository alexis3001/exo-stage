'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../../supabase/supabaseclient'
import Navbar from "@/components/Navbar";

// export default function ProfilePage() {
//   return (
//     <main>
//       <Navbar isAuthenticated={true} />
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-4">👤 Mon profil</h1>
//         <p>Bienvenue sur ta page profil ! Ici tu pourras gérer ton compte.</p>
//       </div>
//     </main>
//   );
// }


export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return
      setLoading(true)

      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erreur lors du chargement des favoris:', error)
      } else {
        setFavorites(data)
      }

      setLoading(false)
    }
    fetchFavorites()
  }, [user])

  return (
    <div style={{ padding: '2rem' }}>
      <Link href="/historique">Historique</Link>
      <h1>Mon Profil</h1>

      {!user && <p>Connexion requise.</p>}

      {user && (
        <>
          <h2>Mes Favoris</h2>
          {loading ? (
            <p>Chargement...</p>
          ) : favorites.length === 0 ? (
            <p>Aucun favori enregistré.</p>
          ) : (
            <ul>
              {favorites.map((fav) => (
                <li key={fav.id}>
                  <strong>{fav.google_id}</strong> <br />
                  <small>Ajouté le : {new Date(fav.created_at).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
