<script lang="ts">
	// Props
	let { uniqueGoals, selectedStatus = $bindable("all"), selectedGoal = $bindable("all") } = $props();

	// Status options
	const statusOptions = [
		{ value: "all", label: "All Status" },
		{ value: "achieved", label: "Achieved" },
		{ value: "pending", label: "Pending" },
	];
</script>

<div class="mt-4 p-4 bg-gray-50 rounded-lg">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<!-- Status Filter -->
		<div class="flex flex-col">
			<label for="status" class="text-sm font-medium text-gray-700 mb-1">Status</label>
			<select id="status" bind:value={selectedStatus} class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
				{#each statusOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>

		<!-- Strategic Goal Filter -->
		<div class="flex flex-col">
			<label for="goal" class="text-sm font-medium text-gray-700 mb-1">Strategic Goal</label>
			<select id="goal" bind:value={selectedGoal} class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
				{#each uniqueGoals as goal}
					<option value={goal}>{goal === "all" ? "All Goals" : goal}</option>
				{/each}
			</select>
		</div>
	</div>
</div>
