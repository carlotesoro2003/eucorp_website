<script lang="ts">
	let { successMessage, errorMessage }: { successMessage: string | null; errorMessage: string | null } = $props();
</script>

{#if successMessage}
	<div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
		<p>{successMessage}</p>
	</div>
{/if}

{#if errorMessage}
	<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
		<p>{errorMessage}</p>
	</div>
{/if}
