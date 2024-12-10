<script lang="ts">
	import { Search, ArrowUpDown } from "lucide-svelte";

	const { searchTerm, uniqueGoals, selectedStatus, selectedGoal, sortBy, sortAsc, toggleSort } = $props();
</script>

<div class="bg-white border-b shadow-sm sticky top-0 z-10">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
		<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
			<h1 class="text-3xl font-semibold text-gray-800">Plans Monitoring</h1>

			<div class="flex flex-col md:flex-row items-center gap-4">
				<div class="relative w-full md:w-64">
					<input type="search" bind:value={searchTerm} placeholder="Search plans..." class="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
					<Search class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
				</div>

				<div class="flex items-center gap-4 w-full md:w-auto">
					<select bind:value={selectedStatus} class="w-full md:w-auto pl-4 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
						<option value="all">All Status</option>
						<option value="achieved">Achieved</option>
						<option value="pending">Pending</option>
					</select>

					<select bind:value={selectedGoal} class="w-full md:w-auto pl-4 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
						{#each uniqueGoals as goal}
							<option value={goal}>{goal}</option>
						{/each}
					</select>
				</div>
			</div>
		</div>
	</div>
</div>
