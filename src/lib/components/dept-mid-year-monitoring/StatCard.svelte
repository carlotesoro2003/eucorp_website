<script lang="ts">
	import type { ComponentType } from "svelte";

	const {
		title,
		value,
		icon: Icon,
		color,
	} = $props<{
		title: string;
		value: number;
		icon: ComponentType;
		color: string;
	}>();
</script>

<div class="bg-white rounded-lg shadow p-6">
	<div class="flex items-center">
		<div class={`${color} rounded-full p-3`}>
			<svelte:component this={Icon} class="w-6 h-6 text-white" />
		</div>
		<div class="ml-4">
			<h3 class="text-lg font-medium text-gray-900">{title}</h3>
			<p class="text-2xl font-semibold text-gray-900">{value}</p>
		</div>
	</div>
</div>
