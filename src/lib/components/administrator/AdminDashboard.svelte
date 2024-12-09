<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js';
  import { supabase } from '$lib/supabaseClient';
  Chart.register(...registerables);

  let barChart: Chart | null = null;
  let pieChart: Chart<'doughnut', number[], string> | null = null;
  let recentEvents: { description: string; created_at: string; event_type: string }[] = [];
  let isLoadingEvents = true;

  // Data for Bar Chart (Overview)
  const barChartData = {
    labels: ['March 1', 'March 10', 'March 20', 'March 30'],
    datasets: [
      {
        label: 'Not Achieved',
        data: [40, 60, 45, 70],
        backgroundColor: 'rgba(156, 163, 175, 0.7)', // Light gray for Not Achieved
      },
      {
        label: 'Achieved',
        data: [60, 40, 55, 30],
        backgroundColor: 'rgba(75, 85, 99, 0.7)', // Darker gray for Achieved
      },
    ],
  };

  // Data for Pie Chart (Risk Level)
  const pieChartData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk', 'Very High Risk'],
    datasets: [
      {
        data: [53.9, 21.81, 13.59, 10.93],
        backgroundColor: ['#10b981', '#facc15', '#f97316', '#ef4444'], // Green, Yellow, Orange, Red
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  const fetchRecentEvents = async () => {
    isLoadingEvents = true;
    const { data, error } = await supabase
      .from('recent_events')
      .select('description, created_at, event_type')
      .order('created_at', { ascending: false })
      .limit(5); // Fetch the last 5 events

    if (error) {
      console.error('Error fetching recent events:', error);
    } else {
      recentEvents = data || [];
    }

    isLoadingEvents = false;
  };

  onMount(() => {
    // Initialize charts
    const barChartCtx = document.getElementById('barChart') as HTMLCanvasElement;
    const pieChartCtx = document.getElementById('pieChart') as HTMLCanvasElement;

    barChart = new Chart(barChartCtx, {
      type: 'bar',
      data: barChartData,
      options: {
        ...chartOptions,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            title: {
              display: true,
              text: 'Count',
              color: '#9ca3af',
            },
          },
        },
      },
    });

    pieChart = new Chart(pieChartCtx, {
      type: 'doughnut',
      data: pieChartData,
      options: chartOptions,
    });

    // Fetch recent events
    fetchRecentEvents();
  });
</script>

<div class="min-h-screen p-6 text-gray-100 space-y-6">
  <!-- Header with Welcome Message -->
  
  <!-- Top Metrics Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="stats shadow">
      <div class="stat">
        <div class="stat-title text-gray-400">Total Projects</div>
        <div class="stat-value text-blue-400">25</div>
        <div class="stat-desc text-gray-500">+10% this month</div>
      </div>
    </div>
    <div class="stats shadow">
      <div class="stat">
        <div class="stat-title text-gray-400">Completed Tasks</div>
        <div class="stat-value text-green-400">120</div>
        <div class="stat-desc text-gray-500">+5% from last week</div>
      </div>
    </div>
    <div class="stats shadow">
      <div class="stat">
        <div class="stat-title text-gray-400">Pending Approvals</div>
        <div class="stat-value text-yellow-400">8</div>
        <div class="stat-desc text-gray-500">Needs review</div>
      </div>
    </div>
    <div class="stats shadow">
      <div class="stat">
        <div class="stat-title text-gray-400">New Members</div>
        <div class="stat-value text-purple-400">15</div>
        <div class="stat-desc text-gray-500">Joined this month</div>
      </div>
    </div>
  </div>

  <!-- Charts Section -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Bar Chart (Overview) -->
    <div class="card shadow-lg bg-gray-800">
      <div class="card-body">
        <h2 class="card-title text-gray-200">Overview</h2>
        <div class="h-64">
          <canvas id="barChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Pie Chart (Risk Level) -->
    <div class="card shadow-lg bg-gray-800">
      <div class="card-body">
        <h2 class="card-title text-gray-200">Risk Level</h2>
        <div class="h-64">
          <canvas id="pieChart"></canvas>
        </div>
      </div>
    </div>
  </div>

  <!-- Recent Events Section -->
  <div class="card shadow-lg bg-gray-800 mt-6">
    <div class="card-body">
      <h2 class="card-title text-gray-200">Recent Events</h2>
      {#if isLoadingEvents}
        <div class="text-center">
          <span class="loading loading-spinner text-primary"></span>
          <p>Loading recent events...</p>
        </div>
      {:else if recentEvents.length > 0}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each recentEvents as event}
            <div class="bg-gray-700 p-4 rounded-lg shadow">
              {#if event.event_type == "opportunity"}
              <a class="text-gray-200 text-sm" href="/opportunities">{event.description}</a>
              {/if}
              <p class="text-gray-400 text-xs mt-2">
                {new Date(event.created_at).toLocaleString()}
              </p>
            </div>
          {/each}
        </div>
      {:else}
        <p class="text-gray-400">No recent events to display.</p>
      {/if}
    </div>
  </div>
</div>
