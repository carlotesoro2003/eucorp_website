<script lang="ts">
	import { Bell, Settings } from "lucide-svelte";

	// Get current date in a nice format
	const currentDate = new Date().toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});
</script>

<header class="flex flex-col gap-4 rounded-xle p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
	<div>
		<h1 class="text-3xl font-bold text-gray-900">Welcome</h1>
		<p class="mt-1 text-sm text-gray-500">{currentDate}</p>
	</div>

	
</header>
