<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js';
  Chart.register(...registerables);

  let barChart: Chart | null = null;
  let pieChart: Chart<'doughnut', number[], string> | null = null;

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

  onMount(() => {
    const barChartCtx = document.getElementById('barChart') as HTMLCanvasElement;
    const pieChartCtx = document.getElementById('pieChart') as HTMLCanvasElement;

    // Bar Chart
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

    // Pie Chart
    pieChart = new Chart(pieChartCtx, {
      type: 'doughnut',
      data: pieChartData,
      options: chartOptions,
    });
  });
</script>

<div class="min-h-screen bg-gray-900 p-6 text-gray-100 space-y-6">
  <!-- Header with Welcome Message -->

  <!-- Top Metrics Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="stats shadow bg-gray-800">
      <div class="stat">
        <div class="stat-title text-gray-400">Total Projects</div>
        <div class="stat-value text-blue-400">25</div>
        <div class="stat-desc text-gray-500">+10% this month</div>
      </div>
    </div>
    <div class="stats shadow bg-gray-800">
      <div class="stat">
        <div class="stat-title text-gray-400">Completed Tasks</div>
        <div class="stat-value text-green-400">120</div>
        <div class="stat-desc text-gray-500">+5% from last week</div>
      </div>
    </div>
    <div class="stats shadow bg-gray-800">
      <div class="stat">
        <div class="stat-title text-gray-400">Pending Approvals</div>
        <div class="stat-value text-yellow-400">8</div>
        <div class="stat-desc text-gray-500">Needs review</div>
      </div>
    </div>
    <div class="stats shadow bg-gray-800">
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
</div>
