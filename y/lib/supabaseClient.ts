// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Lê as variáveis de ambiente do arquivo .env
// O Vite exige que as variáveis comecem com "VITE_"
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Uma verificação de segurança para garantir que o .env foi lido
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Erro de configuração: VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não estão definidas no arquivo .env");
}

export const supabase = createClient(supabaseUrl, supabaseKey)