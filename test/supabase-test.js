import { createClient } from '@supabase/supabase-js';

// Remplace les deux lignes ci-dessous avec tes vraies infos Supabase
const supabaseUrl = 'https://opfgrccxejjlbwbzivdy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wZmdyY2N4ZWpqbGJ3YnppdmR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMjMwMTMsImV4cCI6MjA3MTY5OTAxM30.TsROiOeRkx3KA8jSs_Dh4rxanaz6up2fgcZAOuWlxYo'; // ta clé anon complète ici

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  const { data, error } = await supabase.auth.signUp({
    email: 'testuser@example.com',
    password: 'password123',
  });

  if (error) {
    console.error('Erreur :', error.message);
  } else {
    console.log('Succès ! Utilisateur créé :', data);
  }
}

testSupabaseConnection();
