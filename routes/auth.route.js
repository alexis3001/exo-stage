import { createRouter } from 'next-connect';
import { supabase } from '../supabase/supabaseclient';

const router = createRouter();

router.post('/signup', async (req, res) => {
  const { email, password, nom } = req.body;

  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });

  // Insertion du profil dans la table "profiles"
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([{ email, nom }]);

  if (profileError) return res.status(400).json({ error: profileError.message });

  return res.status(200).json({ user });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { user, error } = await supabase.auth.signIn({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });

  return res.status(200).json({ user });
});

export default router;
