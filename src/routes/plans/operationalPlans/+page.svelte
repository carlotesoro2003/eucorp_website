    <script lang="ts">
        import { supabase } from "$lib/supabaseClient";
        import { onMount } from "svelte";
        import { goto } from '$app/navigation'; // Importing Svelte's navigation for routing
        
        // Define the types for strategic goals and objectives
        interface StrategicGoal {
            id: number;
            name: string;
            goal_no: number;
        }
        
        interface StrategicObjective {
            id: number;
            name: string;
            strategic_initiatives: string;
            kpi: string;
            persons_involved: string;
            target: string;
            eval_measures: string;
        }
        
        let goals: StrategicGoal[] = [];
        let selectedGoalId: number | null = null;
        let objectives: StrategicObjective[] = [];
        let isLoading = false;
        
        // Fetch all strategic goals from the database
        const fetchGoals = async () => {
            isLoading = true;
            const { data, error } = await supabase
                .from('strategic_goals')
                .select('id, name, goal_no');
            
            if (error) {
                console.error('Error fetching strategic goals:', error);
            } else {
                goals = data as StrategicGoal[];
            }
            isLoading = false;
        };
        
        // Fetch strategic objectives for the selected goal
        const fetchObjectives = async () => {
            if (selectedGoalId === null) return;
            isLoading = true;
            const { data, error } = await supabase
                .from('strategic_objectives')
                .select('*')
                .eq('strategic_goal_id', selectedGoalId);
            
            if (error) {
                console.error('Error fetching strategic objectives:', error);
            } else {
                objectives = data as StrategicObjective[];
            }
            isLoading = false;
        };
        
        // Fetch goals on component mount
        onMount(() => {
            fetchGoals();
        });
        
        const viewObjective = (objectiveId: number) => {
            // Use the objectiveId in the URL path or as a query parameter
            goto(`/plans/operationalPlans/${objectiveId}`);
        };
    </script>

    <div class="container mx-auto p-4">
        <h1 class="text-3xl font-bold">Operational Plans</h1>
        
        <!-- Loading Spinner -->
        {#if isLoading}
            <span class="loading loading-spinner text-primary">Loading...</span>
        {/if}

        <!-- Dropdown to select a strategic goal -->
        <div class="my-4">
            <label class="block">Select a Strategic Goal:</label>
            <select bind:value={selectedGoalId} class="select select-bordered w-full" on:change={fetchObjectives}>
                <option value="" disabled selected>Select a goal</option>
                {#each goals as goal}
                    <option value={goal.id}>{goal.goal_no} - {goal.name}</option>
                {/each}
            </select>
        </div>

        <!-- Display the strategic objectives for the selected goal -->
        {#if selectedGoalId && objectives.length > 0}
            <div class="mt-8">
                <h2 class="text-xl font-bold mb-4">Strategic Objectives for Goal No {goals.find(g => g.id === selectedGoalId)?.goal_no}</h2>
                <p class="mb-4">Strategic Goal: {goals.find(g => g.id === selectedGoalId)?.name}</p>
                <table class="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Objective</th>
                            <th>Strategic Initiatives</th>
                            <th>KPI</th>
                            <th>Persons Involved</th>
                            <th>Target</th>
                            <th>Evaluation Measures</th>
                            <th>Action</th> <!-- Added Action column for the button -->
                        </tr>
                    </thead>
                    <tbody>
                        {#each objectives as objective}
                            <tr>
                                <td>{objective.name}</td>
                                <td>{objective.strategic_initiatives}</td>
                                <td>{objective.kpi}</td>
                                <td>{objective.persons_involved}</td>
                                <td>{objective.target}</td>
                                <td>{objective.eval_measures}</td>
                                <td>
                                    <!-- View Button -->
                                    <button 
                                        class="btn btn-primary"
                                        on:click={() => viewObjective(objective.id)}>
                                        Add Action Plans
                                    </button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {:else if selectedGoalId}
            <div class="mt-4">
                <p>No objectives found for this goal.</p>
            </div>
        {/if}
    </div>
