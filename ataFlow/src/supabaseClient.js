import { createClient } from '@supabase/supabase-js';

// O React lê as chaves que você salvou no arquivo .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Cria e exporta a conexão pronta para ser usada em qualquer tela
export const supabase = createClient(supabaseUrl, supabaseKey);