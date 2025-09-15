import Link from "next/link";
import BoutonConnecté from "@/components/BoutonConnecté";


export default function HomePage() {
  return (
    <main style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      fontFamily: 'arial',
      textAlign: 'center'
    }}>
      <header style={{
        position: 'absolute',
        top: 0,
        width: '100%',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '1rem',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #ddd'
      }}>
        <BoutonConnecté />
      </header>

      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        Bienvenue sur mon site ✨
      </h1>
      <p style={{ fontSize: '1.2rem', maxWidth: 600 }}>
        Ceci est la page d’accueil de Mon application Next.js avec Supabase.
      </p>
      <div style={{ marginTop: '2rem' }}>
        <Link href="/connexion" style={{
          textDecoration: 'none',
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: '#fff',
          borderRadius: '5px',
          fontSize: '1rem',
        }}>
          Accéder à la page d’inscription
        </Link>
      </div>
    </main>
  );
}








