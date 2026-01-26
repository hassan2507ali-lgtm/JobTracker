import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Debugging: Cek di Terminal VS Code (bukan browser) apakah kunci terbaca
console.log("Cek URL:", supabaseUrl ? "✅ Ada isinya" : "❌ KOSONG/UNDEFINED")
console.log("Cek Key:", supabaseAnonKey ? "✅ Ada isinya" : "❌ KOSONG/UNDEFINED")

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL atau Key belum disetting di .env.local!")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)