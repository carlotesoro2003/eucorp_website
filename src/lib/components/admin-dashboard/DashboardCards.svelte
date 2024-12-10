<script lang="ts">
	let { data }: { data: Array<{ title: string; value: string; change: number; icon: string }> } = $props();

	// Get dynamic color based on change value
	const getChangeColor = (change: number) => {
		return change >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600";
	};
</script>

<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
	{#each data as card}
		<div class="group relative overflow-hidden rounded-lg border border-border p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-500">{card.title}</p>
					<p class="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
				</div>
				<div class="rounded-xl bg-blue-50 p-4 text-2xl text-blue-600 transition-transform duration-300 group-hover:rotate-12">
					{card.icon}
				</div>
			</div>
			<div class="mt-4">
				<span class={`inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium ${getChangeColor(card.change)}`}>
					{card.change >= 0 ? "↑" : "↓"}
					{Math.abs(card.change)}%
				</span>
				<span class="ml-2 text-sm text-gray-500">from last month</span>
			</div>
		</div>
	{/each}
</div>
