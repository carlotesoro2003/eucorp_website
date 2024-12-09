import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';

// Anon Client (For Client-Side)
const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseAnonKey = PUBLIC_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Service Role Client (For Server-Side Admin Operations)
const supabaseServiceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxa3d3Ym1ic3dtcGpwZnp0dG92Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTMwODMxMCwiZXhwIjoyMDQ0ODg0MzEwfQ.cEbZx4Mcqr-1o3nfw5g8e1pMb0CNGfdZN6FACBa60eo"; 
if (!supabaseServiceRoleKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined');
}
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
