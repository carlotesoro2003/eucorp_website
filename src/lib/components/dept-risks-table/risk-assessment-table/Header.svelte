<script lang="ts">
	let { departmentName }: { departmentName: string } = $props();
</script>

<header class="bg-white dark:bg-gray-800 shadow-sm">
	<div class="container mx-auto px-4 py-6">
		<h1 class="text-3xl font-bold text-gray-900 dark:text-white">
			{departmentName} Risk Register
		</h1>
		<p class="mt-2 text-sm text-gray-600 dark:text-gray-300">Manage and assess department risks</p>
	</div>
</header>
