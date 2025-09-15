'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseclient'; // adapte le chemin si besoin
import { useRouter } from 'next/navigation';

export default function BoutonConnecté() {
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsConnected(!!session); // true si session existe
    };

    checkUser();

    // Optionnel : mettre à jour si l'utilisateur se connecte ou se déconnecte
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsConnected(!!session);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (!isConnected) return null; // n'affiche rien si l'utilisateur n'est pas connecté

  return (
    <button
      onClick={() => router.push('/profil')}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Accéder à mon profil
    </button>
  );
}
