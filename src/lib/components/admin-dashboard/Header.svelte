<script lang="ts">
	import { Bell, Settings } from "lucide-svelte";

	// Get current date in a nice format
	const currentDate = new Date().toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	// Determine the current school year based on today's date
	function getCurrentSchoolYear(): string {
		const today = new Date();
		const startYear = today.getMonth() >= 7 ? today.getFullYear() : today.getFullYear() - 1;
		const endYear = startYear + 1;
		return `${startYear}-${endYear}`;
	}

	const currentSchoolYear = getCurrentSchoolYear();
</script>

<header class="flex flex-col gap-4 rounded-xle p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
	<div>
		<h1 class="text-3xl font-bold text-gray-900">Welcome</h1>
		<p class="mt-1 text-sm text-gray-500">{currentDate}</p>
		<p class="mt-1 text-sm text-gray-500"> <strong>Current School Year: {currentSchoolYear}</strong></p>
	</div>
</header>
