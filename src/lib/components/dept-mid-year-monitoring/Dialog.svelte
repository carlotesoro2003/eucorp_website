<script lang="ts">
	const { showDialog, closeDialog, title, message } = $props<{
		showDialog: boolean;
		closeDialog: () => void;
		title: string;
		message: string;
	}>();
</script>

{#if showDialog}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
		<div class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-auto" role="dialog" aria-modal="true" aria-labelledby="modal-title">
			<div class="p-6">
				<h2 id="modal-title" class="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
				<div class="prose max-w-none">
					<p class="text-gray-600">{message}</p>
				</div>
			</div>
			<div class="bg-gray-50 px-6 py-4 rounded-b-lg">
				<button onclick={closeDialog} class="w-full inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Close</button>
			</div>
		</div>
	</div>
{/if}
