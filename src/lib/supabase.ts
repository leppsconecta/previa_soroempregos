
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('[Supabase] VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY devem estar definidos no .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const supabaseCapturaUrl = import.meta.env.VITE_SUPABASE_CAPTURA_URL;
const supabaseCapturaAnonKey = import.meta.env.VITE_SUPABASE_CAPTURA_ANON_KEY;

export const supabaseCaptura = supabaseCapturaUrl && supabaseCapturaAnonKey
    ? createClient(supabaseCapturaUrl, supabaseCapturaAnonKey)
    : supabase;
