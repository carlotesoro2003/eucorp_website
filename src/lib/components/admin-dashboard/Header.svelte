<script lang="ts">
	import { Bell, Settings } from "lucide-svelte";
	import { supabase } from "$lib/supabaseClient";

	// Get current date in a nice format
	const currentDate = new Date().toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	// Fetch the current school year from the database
	let currentSchoolYear: string | null = null;

	async function fetchCurrentSchoolYear() {
		try {
			const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
			const { data, error } = await supabase
				.from("school_years")
				.select("school_year")
				.lte("start_date", today)
				.gte("end_date", today)
				.single();

			if (error) {
				console.error("Error fetching school year:", error);
				currentSchoolYear = "Unknown";
			} else {
				currentSchoolYear = data?.school_year || "Unknown";
			}
		} catch (err) {
			console.error("Unexpected error fetching school year:", err);
			currentSchoolYear = "Unknown";
		}
	}

	fetchCurrentSchoolYear();
</script>

<header class="flex flex-col gap-4 rounded-xle p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
	<div>
		<h1 class="text-3xl font-bold text-gray-900">Welcome</h1>
		<p class="mt-1 text-sm text-gray-500">{currentDate}</p>
		<p class="mt-1 text-sm text-gray-500">Current School Year: {currentSchoolYear || "Loading..."}</p>
	</div>
</header>