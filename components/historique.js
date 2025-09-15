'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../supabase/supabaseclient'

export default function Historique() {
  const [history, setHistory] = useState([])
  const [user, setUser] = useState(null)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserAndHistory = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        console.error('Erreur utilisateur :', userError)
        return
      }

      setUser(user)

      const { data, error } = await supabase
        .from('history')
        .select('*')
        .eq('user_id', user.id)
        .order('visited_at', { ascending: false })

      if (error) {
        console.error('Erreur chargement historique :', error)
      } else {
        setHistory(data)
      }

      setLoading(false)
    }

    fetchUserAndHistory()
  }, [])

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('history')
      .delete()
      .eq('id', id)

    if (!error) {
      setHistory(history.filter(item => item.id !== id))
    } else {
      console.error('Erreur suppression :', error)
    }
  }

  const handleUpdate = async (id, note, rating) => {
    const { error } = await supabase
      .from('history')
      .update({ note, rating })
      .eq('id', id)

    if (!error) {
      setHistory(history.map(item =>
        item.id === id ? { ...item, note, rating } : item
      ))
      setEditing(null)
    } else {
      console.error('Erreur mise à jour :', error)
    }
  }

  if (loading) return <p>Chargement...</p>

  return (
    <div className="space-y-4">
      {history.length === 0 ? (
        <p>Aucune page visitée n’a encore été enregistrée.</p>
      ) : (
        history.map((entry) => (
          <div key={entry.id} className="border p-4 rounded shadow">
            <p><strong>Page visitée :</strong> {entry.page}</p>
            <p><strong>Date de visite :</strong> {entry.visited_at ? new Date(entry.visited_at).toLocaleString() : 'Inconnue'}</p>
            <div className="space-x-2 mt-2">
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => handleDelete(entry.id)}
              >
                Supprimer
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
