import { NextResponse } from 'next/server';
import { supabase } from '../../../supabase/supabaseclient';

export async function POST(request) {
  try {
    const { email, password, nom } = await request.json();

    // Création du compte utilisateur
    const { user, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      return NextResponse.json(
        { error: signUpError.message },
        { status: 400 }
      );
    }

    // Insertion du profil dans la table "profiles"
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ email, nom }]);

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
