<script lang="ts">
	import type { Snippet } from "svelte";

	/** Props */
	let { show = $bindable(false), children }: { show: boolean; children: Snippet } = $props();
</script>

{#if show}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
			<div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity"></div>
			<div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
				{@render children()}
			</div>
		</div>
	</div>
{/if}
