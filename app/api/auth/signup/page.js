"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../components/Supabase/supabaseclient"; // adapte le chemin selon ta structure

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Création du compte utilisateur avec Supabase
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // Ajout des infos utilisateur dans la table "profiles"
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([{ email, nom }]);

    if (profileError) {
      setError(profileError.message);
      return;
    }

    setSuccess("Inscription réussie !");
    setTimeout(() => {
      router.push("/"); // Redirection vers la page d’accueil
    }, 1000);
  };

  return (
    <main style={{ padding: 20, maxWidth: 500, margin: "auto" }}>
      <h1>Inscription</h1>
      <form onSubmit={handleSignup}>
        <div style={{ marginBottom: 10 }}>
          <label htmlFor="nom">Nom :</label>
          <input
            type="text"
            id="nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label htmlFor="password">Mot de passe :</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <button type="submit" style={{ padding: "10px 20px" }}>
          S'inscrire
        </button>

        {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
        {success && <p style={{ color: "green", marginTop: 10 }}>{success}</p>}
      </form>
    </main>
  );
}
