// components/supabase/supabaseclient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("❌ Supabase URL ou Anon Key manquant dans .env.local")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
