<script lang="ts">
	import { supabase } from "../../supabaseClient";
	import { onMount } from "svelte";
  
	let recentEvents: Array<{ description: string; created_at: string; event_type: string }> = [];
	let isLoadingEvents: boolean = true;
  
	const getEventStyles = (type: string) => {
	  switch (type) {
		case "warning":
		  return "bg-yellow-50 border-yellow-100";
		case "error":
		  return "bg-red-50 border-red-100";
		default:
		  return "bg-green-50 border-green-100";
	  }
	};
  
	const getEventDot = (type: string) => {
	  switch (type) {
		case "warning":
		  return "bg-yellow-400";
		case "error":
		  return "bg-red-400";
		default:
		  return "bg-green-400";
	  }
	};
  
	const fetchRecentEvents = async () => {
	  isLoadingEvents = true;
	  try {
		const { data, error } = await supabase
		  .from("recent_events")
		  .select("description, created_at, event_type")
		  .order("created_at", { ascending: false })
		  .limit(5); // Fetch the last 5 events
  
		if (error) {
		  console.error("Error fetching recent events:", error);
		  recentEvents = [];
		} else {
		  recentEvents = data || [];
		}
	  } catch (error) {
		console.error("Unexpected error fetching recent events:", error);
		recentEvents = [];
	  } finally {
		isLoadingEvents = false;
	  }
	};
  
	onMount(() => {
	  fetchRecentEvents();
	});
  </script>
  
  <div class="rounded-lg bg-card border border-border p-4 hover:shadow-lg transition-all duration-300">
	<h2 class="mb-6 text-xl font-semibold">Recent Events</h2>
	{#if isLoadingEvents}
	  <div class="text-center">
		<span class="loading loading-spinner text-primary"></span>
		<p>Loading recent events...</p>
	  </div>
	{:else if recentEvents.length > 0}
	  <div class="space-y-4">
		{#each recentEvents as event}
		  <div
			class={`flex items-center gap-4 rounded-lg border p-4 transition-all duration-300 hover:-translate-x-1 ${getEventStyles(
			  event.event_type
			)}`}
		  >
			<div class={`h-3 w-3 rounded-full ${getEventDot(event.event_type)}`}></div>
			<div class="flex-1">
			  <p class="font-medium text-gray-800">{event.description}</p>
			  <p class="text-sm text-gray-500">{new Date(event.created_at).toLocaleString()}</p>
			</div>
		  </div>
		{/each}
	  </div>
	{:else}
	  <p class="text-gray-400">No recent events to display.</p>
	{/if}
  </div>
  