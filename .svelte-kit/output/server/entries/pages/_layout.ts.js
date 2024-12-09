import { s as supabase } from "../../chunks/supabaseClient.js";
const load = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user, session };
};
export {
  load
};
