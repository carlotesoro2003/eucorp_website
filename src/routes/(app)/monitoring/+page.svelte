<script lang="ts">
    import "tailwindcss/tailwind.css";
    import { writable, get } from 'svelte/store';
    import axios from 'axios';

    let goals = writable<{ id: number; goal: string; evaluation: string; achieved: string | null; isLoading: boolean }[]>([]);

    // Dialog state for showing the AI evaluation
    let showDialog = false;
    let dialogMessage = '';

    // Define the backend URL
    const backendUrl = 'http://localhost:3000/evaluate-goal';

    // Function to evaluate a single goal
    async function evaluateGoal(id: number, goal: string, evaluation: string) {
        try {
            // Make a POST request to the backend
            const response = await axios.post(backendUrl, { target: goal, evaluation });

            // Get the AI evaluation result
            let aiEvaluation = response.data.aiEvaluation;

            // Prefix with "Yes" or "No" based on the content of aiEvaluation
            const negativeKeywords = ["not achieved", "unsuccessful", "failed", "incomplete", "fell short", "below target", "did not meet", "not", "not been achieved"];

            const isAchieved = !negativeKeywords.some(neg => aiEvaluation.toLowerCase().includes(neg));

            // Prefix with "Yes" or "No" based on whether the goal is achieved
            aiEvaluation = `${isAchieved ? "Yes: " : "No: "} ${aiEvaluation}`;


            // Update the specific goal's "achieved" field with the prefixed result
            goals.update(currentGoals =>
                currentGoals.map(g => g.id === id ? { ...g, achieved: aiEvaluation, isLoading: false } : g)
            );

            // Show the dialog with the AI evaluation result
            dialogMessage = aiEvaluation;
            showDialog = true;
        } catch (error) {
            console.error("Error evaluating goal:", error);
            goals.update(currentGoals =>
                currentGoals.map(g => g.id === id ? { ...g, isLoading: false } : g)
            );
        }
    }

    // Function to evaluate all goals
    async function evaluateAllGoals() {
        const allGoals = get(goals);
        for (const goal of allGoals) {
            if (goal.goal && goal.evaluation) {
                await evaluateGoal(goal.id, goal.goal, goal.evaluation);
            }
        }
    }

    // Handle input changes
    function handleInput(id: number, field: 'goal' | 'evaluation', value: string) {
        goals.update(currentGoals =>
            currentGoals.map(g => g.id === id ? { ...g, [field]: value} : g)
        );
    }

    // Function to add a new goal row
    const addGoalRow = () => {
        goals.update(currentGoals => [
            ...currentGoals,
            { id: Date.now(), goal: '', evaluation: '', achieved: null, isLoading: false }
        ]);
    };

    // Function to delete a goal
    const deleteGoal = (id: number) => {
        goals.update(currentGoals => currentGoals.filter(goal => goal.id !== id));
    };

    // Add an initial goal row if none exist
    $: if (get(goals).length === 0) addGoalRow();

    // Function to open the dialog with a specific message
    function openDialog(message: string) {
        dialogMessage = message;
        showDialog = true;
    }
</script>

<!-- Page Layout -->
<div class="min-h-screen bg-base-300 p-8">
    <h1 class="text-2xl font-bold mb-4">Monitoring Page</h1>

    <button on:click={addGoalRow} class="btn  bg-indigo-500 hover:bg-indigo-600 text-white font-medium mb-4">Add New Goal</button>
    <button on:click={evaluateAllGoals} class="btn bg-teal-500 hover:bg-teal-600 text-white font-medium mb-4">Evaluate All Goals with Gemini AI</button>

    <table class="table-auto w-full shadow-lg rounded-lg overflow-hidden">
        <thead>
            <tr class="uppercase text-sm">
                <th class="px-6 py-3">Target</th>
                <th class="px-6 py-3">Evaluation</th>
                <th class="px-6 py-3">Achieved</th>
                <th class="px-6 py-3">Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each $goals as { id, goal, evaluation, achieved, isLoading }}
                <tr class="border-b">
                    <td class="px-6 py-4">
                        <textarea
                            class="w-full border border-gray-300 rounded px-2 py-1"
                            value={goal}
                            on:input={(e) => handleInput(id, 'goal', (e.target as HTMLInputElement).value)}
                        ></textarea>
                    </td>
                    <td class="px-6 py-4">
                        <textarea
                            class="w-full border border-gray-300 rounded px-2 py-1"
                            value={evaluation}
                            on:input={(e) => handleInput(id, 'evaluation', (e.target as HTMLInputElement).value)}
                        ></textarea>
                    </td>
                    <td class="px-6 py-4">
                        {#if isLoading}
                            <span class="loading loading-spinner text-primary"></span>

                        {:else if achieved}
                            <span
                                class="text-blue-500 cursor-pointer underline"
                                role="button"
                                tabindex="0"
                                on:click={() => openDialog(achieved)}
                                on:keydown={(e) => e.key === 'Enter' && openDialog(achieved)}
                            >
                                {achieved.startsWith("Yes") ? "Achieved" : "Not Achieved"}
                            </span>
                        {:else}
                            Pending
                        {/if}
                    </td>
                    <td class="px-6 py-4">
                        <button
                            on:click={() => evaluateGoal(id, goal, evaluation)}
                            class="btn btn-ghost btn-sm"
                            disabled={!goal || !evaluation}
                        >
                            Evaluate
                        </button>
                        <button on:click={() => deleteGoal(id)} class="btn btn-error btn-sm ml-2">
                            Delete
                        </button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>

    <!-- Modal Dialog for AI Evaluation Result -->
    {#if showDialog}
        <div class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div class="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 class="text-lg font-bold mb-4">AI Evaluation Statement</h2>
                <p class="mb-4">{dialogMessage}</p>
                <button on:click={() => (showDialog = false)} class="btn btn-primary w-full">
                    Close
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    .btn-primary {
        color: white;
    }

    .btn-secondary {
        color: white;
    }

    .btn-error {
        background-color: #ef4444;
        color: white;
    }

    .textarea     {
        border: 1px solid #d1d5db;
        padding: 0.5rem;
        border-radius: 0.375rem;
        width: 100%;
    }
</style>
