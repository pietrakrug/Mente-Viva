import { createClient } from '@supabase/supabase-js';

// These are the credentials for your specific Supabase project.
const supabaseUrl = 'https://jzebhmrcsltzjqebxczx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6ZWJobXJjc2x0empxZWJ4Y3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMjE3MDUsImV4cCI6MjA3Njg5NzcwNX0.mbDvzikIVYIgOW8xUO672MgRbVhoEipd9QmGV-Y_cMQ';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key must be provided.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
