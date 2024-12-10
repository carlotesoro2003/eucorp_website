<script lang="ts">
	const { showDialog, dialogStatement, onClose } = $props();
</script>

{#if showDialog}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
		<div class="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
			<h2 class="text-lg font-semibold text-gray-900 mb-4">Evaluation Statement</h2>
			<div class="bg-gray-50 rounded-lg p-4 text-gray-700 mb-6">{dialogStatement}</div>
			<button onclick={onClose} class="w-full inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">Close</button>
		</div>
	</div>
{/if}
