import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key must be provided in the .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
