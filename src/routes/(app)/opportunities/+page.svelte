<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import AdminOpportunities from "$lib/components/administrator/AdminOpportunities.svelte";
  import DepartmentOpportunities from "$lib/components/departments/DepartmentOpportunities.svelte";

  export let data: { session: any };
  const { session } = data;

  // Define the profile role
  let profile: {role?: string;} | null = null;
  let loading = true;

  // Fetch the user's profile  to get the role  
  const fetchUserProfile = async () => {
      if (session) {
          const { user } = session;
          const { data, error } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", user.id)
              .single();

          if (error) {
              console.error("Error fetching user profile:", error.message);
          } else {
              profile = data;
              console.log("Role in Opportunities: ", profile);
          }
      }
      loading = false; 
  };

  fetchUserProfile();


</script>


<div>
  {#if loading}
 
  {:else if session !== null && profile}
    {#if profile.role === 'admin' || profile.role == 'vice_president' || profile.role == 'president'}
      <AdminOpportunities />
    {:else}
      <DepartmentOpportunities />
    {/if}
  {/if}
</div>