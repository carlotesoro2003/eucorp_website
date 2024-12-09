import { createClient } from "@supabase/supabase-js";
const PUBLIC_SUPABASE_URL = "https://eqkwwbmbswmpjpfzttov.supabase.co";
const PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxa3d3Ym1ic3dtcGpwZnp0dG92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkzMDgzMTAsImV4cCI6MjA0NDg4NDMxMH0.ls_6JYk4ofeuvkr3X6aJtqJ3I9FoDxZd4wWbt0OJDlU";
const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseAnonKey = PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseServiceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxa3d3Ym1ic3dtcGpwZnp0dG92Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTMwODMxMCwiZXhwIjoyMDQ0ODg0MzEwfQ.cEbZx4Mcqr-1o3nfw5g8e1pMb0CNGfdZN6FACBa60eo";
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
export {
  supabaseAdmin as a,
  supabase as s
};
