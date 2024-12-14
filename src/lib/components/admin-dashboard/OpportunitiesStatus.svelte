<script lang="ts">
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";
    import { supabase } from "$lib/supabaseClient";
    import { Loader2 } from "lucide-svelte";

    // State variables
    let opportunities = $state({ achieved: 0, notAchieved: 0, total: 0 });
    let isLoading = $state(true);
    let canvas: HTMLCanvasElement;
    let chart: Chart | null = null;

    const fetchOpportunities = async () => {
        try {
            const { data, error } = await supabase
                .from("opt_monitoring")
                .select("is_accomplished");

            if (error) throw error;

            const achieved = data.filter(item => item.is_accomplished).length;
            const total = data.length;
            
            opportunities = {
                achieved,
                notAchieved: total - achieved,
                total
            };

            // Create chart after data is loaded
            setTimeout(() => {
                createChart();
            }, 0);
            
        } catch (error) {
            console.error("Error fetching opportunities:", error);
        } finally {
            isLoading = false;
        }
    };

    const createChart = () => {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["Achieved", "Not Achieved"],
                datasets: [{
                    data: [opportunities.achieved, opportunities.notAchieved],
                    backgroundColor: ["#34C759", "#FF3B30"],
                    borderWidth: 2,
                    borderColor: "#ffffff"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "65%",
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    };

    onMount(() => {
        fetchOpportunities();
    });
</script>

<div class="w-full rounded-lg border bg-card border-border p-4 hover:shadow-lg transition-all duration-300">
    <h2 class="mb-6 text-xl font-semibold">Opportunities Status</h2>

    {#if isLoading}
        <div class="flex justify-center p-8">
            <Loader2 class="h-8 w-8 animate-spin" />
        </div>
    {:else}
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <p class="font-medium text-md">
            Total Opportunities: {opportunities.total}
        </p>
       
    </div>
        <div class="h-[300px]">
            <canvas bind:this={canvas}></canvas>
        </div>
        
    {/if}
</div>