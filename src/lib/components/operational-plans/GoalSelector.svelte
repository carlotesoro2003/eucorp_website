<script lang="ts">
	/** Props */
	let {
		selectedGoalId = $bindable(null),
		goals,
		onSelect,
	}: {
		selectedGoalId: number | null;
		goals: Array<{ id: number; name: string; goal_no: number }>;
		onSelect: () => void;
	} = $props();
</script>

<div class="w-full md:w-[300px]">
	<label class="block mb-2 font-medium">Select Strategic Goal:</label>
	<select bind:value={selectedGoalId} onchange={onSelect} class="select select-bordered w-full bg-secondary border-secondary rounded-lg">
		<option value="" disabled selected>Select a goal</option>
		{#each goals as goal}
			<option value={goal.id}>
				{goal.goal_no} - {goal.name}
			</option>
		{/each}
	</select>
</div>
