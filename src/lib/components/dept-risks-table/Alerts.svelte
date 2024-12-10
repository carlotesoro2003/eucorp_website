<script lang="ts">
	import { CheckCircle, XCircle } from "lucide-svelte";

	let { successMessage, errorMessage }: { successMessage: string | null; errorMessage: string | null } = $props();
</script>

{#if successMessage}
	<div class="flex items-center gap-2 p-4 mb-4 text-sm rounded-lg bg-green-50 text-green-600">
		<CheckCircle class="w-5 h-5" />
		<span>{successMessage}</span>
	</div>
{/if}

{#if errorMessage}
	<div class="flex items-center gap-2 p-4 mb-4 text-sm rounded-lg bg-red-50 text-red-600">
		<XCircle class="w-5 h-5" />
		<span>{errorMessage}</span>
	</div>
{/if}
