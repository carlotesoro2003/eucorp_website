// @ts-nocheck
import { supabase } from '$lib/supabaseClient';
import type { LayoutLoad } from './$types';

export const load = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const { data: { user } } = await supabase.auth.getUser();

  return { supabase, user, session };
};null as any as LayoutLoad;