<script lang="ts">
	import { Bell, Settings } from "lucide-svelte";
	import { supabase } from "$lib/supabaseClient";
	import { fade, fly } from "svelte/transition";

	// Get current date in a nice format
	const currentDate = new Date().toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	// Fetch the current school year from the database
	let currentSchoolYear: string | null = $state(null);
	let loading: boolean = $state(true);

	/** Fetch current school year from database */
	async function fetchCurrentSchoolYear() {
		try {
			const today = new Date().toISOString().split("T")[0];
			const { data, error } = await supabase.from("school_years").select("school_year").lte("start_date", today).gte("end_date", today).single();

			if (error) {
				console.error("Error fetching school year:", error);
				currentSchoolYear = "Unknown";
			} else {
				currentSchoolYear = data?.school_year || "Unknown";
			}
		} catch (err) {
			console.error("Unexpected error fetching school year:", err);
			currentSchoolYear = "Unknown";
		} finally {
			loading = false;
		}
	}

	// Fetch school year when component mounts
	fetchCurrentSchoolYear();
</script>

<div class="flex flex-col">
	<header class="overflow-x-auto bg-card rounded-lg  border border-border p-6">
		<div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
			<!-- Left side: Welcome message and dates -->
			<div in:fly={{ y: 20, duration: 700 }}>
				<h1 class="text-3xl font-bold text-foreground">Welcome Back</h1>
				<p class="mt-2 text-sm font-medium text-muted-foreground">{currentDate}</p>
				<!-- School year with loading state -->
				<div class="mt-1 flex items-center gap-2">
					<p class="text-sm font-medium text-muted-foreground">
						School Year:
						{#if loading}
							<span in:fade class="ml-1 animate-pulse text-muted-foreground/50">Loading...</span>
						{:else}
							<span in:fade class="ml-1 rounded-full bg-secondary px-2 py-0.5 text-foreground">
								{currentSchoolYear}
							</span>
						{/if}
					</p>
				</div>
			</div>

		
		</div>
	</header>
</div>
