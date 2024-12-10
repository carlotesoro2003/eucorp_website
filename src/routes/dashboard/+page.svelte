    <script lang="ts">
        import "tailwindcss/tailwind.css";
        import { goto } from '$app/navigation';
        import { supabase } from '$lib/supabaseClient'; 
        import AdminDashboard from "$lib/components/administrator/AdminDashboard.svelte";
        import DepartmentDashboard from "$lib/components/departments/DepartmentDashboard.svelte";

        export let data: { session: any };
        const { session } = data;

        // Define the profile object, including profile_pic for the profile picture URL
        let profile: { first_name?: string; last_name?: string; role?: string; profile_pic?: string } | null = null;
        let loading = true;

        // Fetch the user's profile details, including the profile_pic field
        const fetchUserProfile = async () => {
            if (session) {
                const { user } = session;
                const { data, error } = await supabase
                    .from("profiles")
                    .select("first_name, last_name, role, profile_pic")
                    .eq("id", user.id)
                    .single();

                if (error) {
                    console.error("Error fetching user profile:", error.message);
                } else {
                    profile = data;
                }
            }
            loading = false; // Set loading to false after the fetch
        };

        fetchUserProfile();

        
    </script>

<div class="min-h-screen ">
    <div class="flex flex-col items-center justify-center w-full h-full">
      <div class="w-full ">
        {#if loading}
          <div class="flex flex-col items-center justify-center">
            <span class="loading loading-spinner loading-sm"></span>
            <p>Loading...</p> <!-- Show loading state -->
          </div>
        {:else if session !== null && profile}
       
          <div class="w-full">
            {#if profile.role === 'admin' || profile.role === 'vice_president' || profile.role === 'president'}
              <AdminDashboard />
            {:else if profile.role === 'user'}
              <DepartmentDashboard />
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
  