<script lang="ts">
	let { events }: { events: Array<{ title: string; time: string; type: string }> } = $props();

	const getEventStyles = (type: string) => {
		switch (type) {
			case "warning":
				return "bg-yellow-50 border-yellow-100";
			case "error":
				return "bg-red-50 border-red-100";
			default:
				return "bg-green-50 border-green-100";
		}
	};

	const getEventDot = (type: string) => {
		switch (type) {
			case "warning":
				return "bg-yellow-400";
			case "error":
				return "bg-red-400";
			default:
				return "bg-green-400";
		}
	};
</script>

<div class="rounded-lg border border-border p-4 hover:shadow-lg transition-all duration-300">
	<h2 class="mb-6 text-xl font-semibold text-gray-800">Recent Events</h2>
	<div class="space-y-4">
		{#each events as event}
			<div class={`flex items-center gap-4 rounded-lg border p-4 transition-all duration-300 hover:-translate-x-1 ${getEventStyles(event.type)}`}>
				<div class={`h-3 w-3 rounded-full ${getEventDot(event.type)}`}></div>
				<div class="flex-1">
					<p class="font-medium text-gray-800">{event.title}</p>
					<p class="text-sm text-gray-500">{event.time}</p>
				</div>
			</div>
		{/each}
	</div>
</div>
