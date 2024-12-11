<script lang="ts">
    import { onMount } from 'svelte';
    import {
        dashboardData,
        updateStrategicGoalsCount,
        updateUnmitigatedRisksCount,
        updateOpportunitiesCount,
        updateUsersCount,
    } from './data';

    let cards = dashboardData.cards; // Local copy for reactive updates

    // Fetch updated data on component mount
    onMount(async () => {
        await updateStrategicGoalsCount();
        await updateUnmitigatedRisksCount();
        await updateOpportunitiesCount();
        await updateUsersCount();
        cards = [...dashboardData.cards]; // Reflect updated data
    });

    // Get dynamic color based on change value
    const getChangeColor = (change: number) => {
        return change >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600";
    };
</script>

<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {#each cards as card}
        <div class="group relative overflow-hidden rounded-lg border border-border p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-500">{card.title}</p>
                    <p class="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div class="rounded-xl bg-blue-50 p-4 text-2xl text-blue-600 transition-transform duration-300 group-hover:rotate-12">
                    {card.icon}
                </div>
            </div>
            <div class="mt-4">
               
            </div>
        </div>
    {/each}
</div>
