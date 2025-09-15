"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase/supabaseclient"; // ✅ chemin à adapter si besoin
import BoutonConnecté from "@/components/BoutonConnecté";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [session, setSession] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  // Récupère la session si l'utilisateur est connecté
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    fetchSession();

    // Écoute les changements de session (connexion/déconnexion)
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess("Connexion réussie");
    } else {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      const userId = data.user?.id;

      if (userId) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([{ id: userId, email, nom }]);

        if (profileError) {
          setError(profileError.message);
          return;
        }
      }

      setSuccess("Inscription réussie, vous pouvez maintenant vous connecter.");
      setIsLogin(true);
    }

    setEmail("");
    setPassword("");
    setNom("");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <main style={{ padding: 20, maxWidth: 500, margin: "auto" }}>
      {/* Header */}
      <header style={{
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: "20px",
        borderBottom: "1px solid #eee",
        paddingBottom: "10px",
      }}>
        <BoutonConnecté />
      </header>

      {/* Titre */}
      <h1>{isLogin ? "Connexion" : "Inscription"}</h1>

     {session ? (
  <div>
    <p>✅ Connecté en tant que : {session.user.email}</p>
    <button onClick={handleLogout} style={{ marginTop: 10 }}>
      Se déconnecter
    </button>
    <button
      onClick={() => router.push("../profile")}
      style={{ marginTop: 10, marginLeft: 10 }}
    >
      Voir mon profil
    </button>
  </div>
) : (
  // ... formulaire

        // Sinon afficher formulaire
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: 10 }}>
              <label>Nom :</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                style={{ width: "100%", padding: 8 }}
              />
            </div>
          )}

          <div style={{ marginBottom: 10 }}>
            <label>Email :</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: 8 }}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>Mot de passe :</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: 8 }}
            />
          </div>

          <button type="submit" style={{ padding: "10px 20px" }}>
            {isLogin ? "Se connecter" : "S'inscrire"}
          </button>

          {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
          {success && <p style={{ color: "green", marginTop: 10 }}>{success}</p>}

          <p style={{ marginTop: 15 }}>
            {isLogin ? "Pas encore inscrit ?" : "Déjà inscrit ?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              style={{
                textDecoration: "underline",
                background: "none",
                border: "none",
                color: "blue",
                cursor: "pointer",
              }}
            >
              {isLogin ? "Créer un compte" : "Se connecter"}
            </button>
          </p>
        </form>
      )}
    </main>
  );
}
