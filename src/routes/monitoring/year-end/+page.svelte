<script lang="ts">
    import { supabase } from "$lib/supabaseClient";
    import { AlertCircle, ClipboardList, AlertTriangle, Lightbulb, Monitor } from "lucide-svelte";
  
    // Admin Monitoring Pages
    import AdminPlansMonitoring from "$lib/components/monitoring/admin/AdminPlansMonitoring.svelte";
    import AdminRisksMonitoring from "$lib/components/monitoring/admin/AdminRisksMonitoring.svelte";
    import AdminOptMonitoring from "$lib/components/monitoring/admin/AdminOptMonitoring.svelte";
  
    // Department Monitoring Pages
    import DeptPlansMonitoring from "$lib/components/monitoring/departments/DeptPlansMonitoring.svelte";
    import DeptRisksMonitoring from "$lib/components/monitoring/departments/DeptRisksMonitoring.svelte";
    import DeptOptMonitoring from "$lib/components/monitoring/departments/DeptOptMonitoring.svelte";
  
    export let data: { session: any } | null = null; // Accept null as fallback
    let session: any = null;
  
    // Define the profile role
    let profile: { role?: string } | null = null;
    let loading = true;
    let activeTab = "Plans"; // Default active tab

    const tabs = [
		{ id: "Plans", label: "Plans", icon: ClipboardList },
		{ id: "Risks", label: "Risks", icon: AlertTriangle },
		{ id: "Opportunities", label: "Opportunities", icon: Lightbulb },
	];

  
    // Fetch the user's profile to get the role
    const fetchUserProfile = async () => {
      try {
        if (data?.session) {
          session = data.session; // Extract session from data
          const { user } = session;
  
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();
  
          if (error) {
            console.error("Error fetching user profile:", error.message);
          } else {
            profile = profileData;
            console.log("Role in Opportunities: ", profile);
          }
        } else {
          console.warn("Session is not available or data is missing.");
        }
      } catch (error) {
        console.error("Error fetching user profile or session:", error);
      } finally {
        loading = false; // Stop loading state
      }
    };
  
    // Call the function when component is loaded
    fetchUserProfile();
  
    // Change the active tab
    const changeTab = (tab: string) => {
      activeTab = tab;
    };
  </script>
  
  <div class="min-h-scree">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
        <div class="flex items-center gap-2">
          <Monitor class="w-8 h-8 text-primary" />
          <h1 class="text-2xl font-bold">Year-end Monitoring Dashboard</h1>
        </div>
      </div>
  
      <!-- Tabs -->
      <div class=" dark:bg-gray-800 rounded-lg shadow-sm mb-6">
        <div class="flex flex-wrap gap-2 p-2">
          {#each tabs as tab}
            <button onclick={() => (activeTab = tab.id)} class="flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 {activeTab === tab.id ? 'bg-primary hover:bg-primary/90 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}">
              <svelte:component this={tab.icon} size={18} />
              <span>{tab.label}</span>
            </button>
          {/each}
        </div>
      </div>
  
      <!-- Content -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        {#if loading}
        <div class="flex justify-center p-8 ">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        {:else if session && profile}
          {#if profile.role === "admin" || profile.role === "vice_president" || profile.role === "president"}
            {#if activeTab === "Plans"}
              <AdminPlansMonitoring />
            {:else if activeTab === "Risks"}
              <AdminRisksMonitoring />
            {:else if activeTab === "Opportunities"}
              <AdminOptMonitoring />
            {/if}
          {:else if profile.role === "user"}
            {#if activeTab === "Plans"}
              <DeptPlansMonitoring />
            {:else if activeTab === "Risks"}
              <DeptRisksMonitoring />
            {:else if activeTab === "Opportunities"}
              <DeptOptMonitoring />
            {/if}
          {:else}
            <div class="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
              <AlertCircle size={24} />
              <p>You do not have the required permissions to view this page.</p>
            </div>
          {/if}
        {:else}
          <div class="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
            <AlertCircle size={24} />
            <p>Failed to load session or profile data. Please try refreshing the page.</p>
          </div>
        {/if}
      </div>
    </div>
  </div>