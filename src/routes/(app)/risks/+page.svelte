<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import DepartmentRisks from "$lib/components/departments/DepartmentRisks.svelte";
  import AdminRisks from "$lib/components/administrator/AdminRisks.svelte";
  import { onMount } from "svelte";

  let session: any = null;
  let profile: any = null;
  let isLoading = true;
  let errorMessage: string | null = null;

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      session = sessionData.session;
      if (session) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (profileError) throw profileError;
        
        profile = profileData;
        console.log("Profile Id: ", profile.id);
        console.log("Profile Role: ", profile.role);
      } else {
        errorMessage = "User is not logged in.";
      }
    } catch (error) {
      console.error((error as Error).message);
      errorMessage = "Failed to fetch profile data.";
    } finally {
      isLoading = false;
    }
  };

  onMount(() => {
    fetchUserProfile();
  });
</script>

<div>
  {#if isLoading}
  <div class="flex items-center justify-center min-h-screen ">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
  {:else if errorMessage}
    <p class="text-red-500">{errorMessage}</p>
  {:else}
    {#if profile?.role === 'admin'  || profile?.role === 'vice_president' || profile?.role === 'president'}
      <AdminRisks />
    {:else}
      <DepartmentRisks />
    {/if}
  {/if}
</div>
