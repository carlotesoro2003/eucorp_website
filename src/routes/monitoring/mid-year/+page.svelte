<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { AlertCircle, ClipboardList, AlertTriangle, Lightbulb } from "lucide-svelte";

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

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<div class="container mx-auto px-4 py-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mid-year Monitoring Dashboard</h1>
			<p class="text-gray-600 dark:text-gray-400">Track and manage your organization's plans, risks, and opportunities</p>
		</div>

		<!-- Tabs -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
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
				<div class="flex flex-col items-center justify-center py-12">
					<div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
					<p class="mt-4 text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
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