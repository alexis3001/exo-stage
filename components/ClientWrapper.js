"use client";
import { useEffect, useRef } from "react";
import supabase from "../supabase/supabaseclient";
import { useRouter } from "next/navigation";

export default function ClientWrapper({ children }) {
  const router = useRouter();
  const inactivityTimer = useRef(null);

  useEffect(() => {
    const resetTimer = () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(async () => {
        await supabase.auth.signOut();
        router.push("/Connexion");
      }, 10 * 60 * 1000); // 10 minutes
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    resetTimer();

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, []);

  return <>{children}</>;
}