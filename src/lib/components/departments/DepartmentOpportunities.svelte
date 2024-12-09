<script lang="ts">
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabaseClient";

  interface Opportunity {
    id: number;
    opt_statement: string;
    planned_actions: string;
    kpi: string;
    key_persons: string;
    target_output: string;
    budget: number;
    profile_id: string;
  }

  let opportunities: Opportunity[] = [];
  let selectedOpportunity: Opportunity | null = null;
  let isLoading = false;
  let isSaving = false;
  let formData = [
    {
      opt_statement: "",
      planned_actions: "",
      kpi: "",
      key_persons: "",
      target_output: "",
      budget: 0,
      profile_id: "",
      department_id: "", 
    },
  ];
  let profileId: string | null = null;

  const fetchUserProfile = async (): Promise<void> => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, department_id")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        profileId = data.id; // User's profile ID
        formData.forEach((row) => {
          row.department_id = data.department_id; // Add department_id to each row
        });
      }
    } else {
      console.log("User is not logged in");
    }
  };
  
      const createOpportunity = async () => {
        if (!profileId) return;

        isSaving = true; // Set saving state
        try {
            // Insert the opportunity
            const { data, error } = await supabase.from("opportunities").insert(
                formData.map((row) => ({
                    ...row,
                    profile_id: profileId,
                    department_id: row.department_id, // Include department_id
                }))
            ).select(); // Return the created rows

            if (error) {
                console.error("Error creating opportunities:", error);
                return;
            }

            if (data && data.length > 0) {
        // Map over the created opportunities
        const events = await Promise.all(
            data.map(async (opportunity) => {
                // Fetch the department name based on the department_id
                const { data: departmentData, error: departmentError } = await supabase
                    .from("departments") // Replace with your department table name
                    .select("name")
                    .eq("id", opportunity.department_id)
                    .single();

                if (departmentError) {
                    console.error(`Error fetching department name for ID ${opportunity.department_id}:`, departmentError);
                    return null; // Skip creating event if department fetch fails
                }

                const departmentName = departmentData?.name || "Unknown Department";

                // Return the event object with department name included in description
                return {
                    event_id: opportunity.id, // Use the opportunity's ID
                    event_type: "opportunity",
                    description: `${departmentName} created a new opportunity`,
                };
            })
        );

        // Filter out any null values in case fetching department data failed
        const validEvents = events.filter((event) => event !== null);

        // Insert events into the recent_events table
        if (validEvents.length > 0) {
            const { error: eventError } = await supabase.from("recent_events").insert(validEvents);

            if (eventError) {
                console.error("Error adding to recent events:", eventError);
            } else {
                console.log("Recent events updated successfully.");
            }
        }
    }


        // Reset the form and fetch updated opportunities
        fetchOpportunities();
        formData = [
            {
                opt_statement: "",
                planned_actions: "",
                kpi: "",
                key_persons: "",
                target_output: "",
                budget: 0,
                profile_id: "",
                department_id: "",
            },
        ];
    } catch (err) {
        console.error("Unexpected error:", err);
    } finally {
        isSaving = false; // Reset saving state
    }
};


  const fetchOpportunities = async (): Promise<void> => {
    isLoading = true;
    const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .eq("profile_id", profileId);

    if (error) {
      console.error("Error fetching opportunities:", error);
    } else {
      opportunities = data;
    }
    isLoading = false;
  };

  const deleteRow = (index: number) => {
    formData.splice(index, 1);
    formData = [...formData];
  };

  const addRow = () => {
    formData = [
      ...formData,
      {
        opt_statement: "",
        planned_actions: "",
        kpi: "",
        key_persons: "",
        target_output: "",
        budget: 0,
        profile_id: profileId || "",
        department_id: formData[0]?.department_id || "", // Use existing department_id
      },
    ];
  };

  const adjustTextarea = (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    target.style.height = "auto"; // Reset height to calculate scroll height
    target.style.width = "auto"; // Reset width to calculate scroll width
    target.style.height = `${target.scrollHeight}px`; // Adjust height
    target.style.width = `${Math.max(target.scrollWidth, 200)}px`; // Adjust width with a minimum
  };

  onMount(() => {
    fetchUserProfile();
    if (profileId) {
      fetchOpportunities();
    }
  });
</script>

<div class="container mx-auto p-6">
  <div class="p-6 rounded-lg shadow-lg mb-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">
        {selectedOpportunity ? "Edit Opportunity" : "Create Opportunity"}
      </h2>
      <button
        on:click={() => console.log("Save Progress")}
        class="btn btn-success"
        disabled={isSaving}
      >
        Save Progress
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="table-auto table table-zebra w-full">
        <thead>
          <tr class="text-sm">
            <th class="px-4 py-2 text-left">Opportunity Statement</th>
            <th class="px-4 py-2 text-left">Planned Actions</th>
            <th class="px-4 py-2 text-left">KPI</th>
            <th class="px-4 py-2 text-left">Key Persons</th>
            <th class="px-4 py-2 text-left">Target Output</th>
            <th class="px-4 py-2 text-left">Budget</th>
            <th class="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each formData as row, index}
            <tr>
              <td class="px-4 py-2">
                <textarea
                  bind:value={row.opt_statement}
                  placeholder="Opportunity Statement"
                  class="textarea textarea-bordered w-full"
                  on:input={adjustTextarea}
                  style="overflow: hidden"
                ></textarea>
              </td>
              <td class="px-4 py-2">
                <textarea
                  bind:value={row.planned_actions}
                  placeholder="Planned Actions"
                  class="textarea textarea-bordered w-full"
                  on:input={adjustTextarea}
                  style="overflow: hidden"
                ></textarea>
              </td>
              <td class="px-4 py-2">
                <textarea
                  bind:value={row.kpi}
                  placeholder="KPI"
                  class="textarea textarea-bordered w-full"
                  on:input={adjustTextarea}
                  style="overflow: hidden"
                ></textarea>
              </td>
              <td class="px-4 py-2">
                <textarea
                  bind:value={row.key_persons}
                  placeholder="Key Persons"
                  class="textarea textarea-bordered w-full"
                  on:input={adjustTextarea}
                  style="overflow: hidden"
                ></textarea>
              </td>
              <td class="px-4 py-2">
                <textarea
                  bind:value={row.target_output}
                  placeholder="Target Output"
                  class="textarea textarea-bordered w-full"
                  on:input={adjustTextarea}
                  style="overflow: hidden"
                ></textarea>
              </td>
              <td class="px-4 py-2">
                <input
                  type="number"
                  bind:value={row.budget}
                  placeholder="Budget"
                  class="input input-bordered w-full"
                />
              </td>
              <td class="px-4 py-2">
                <button
                  class="btn btn-sm btn-error"
                  on:click={() => deleteRow(index)}
                >
                  Delete
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <button on:click={addRow} class="btn btn-secondary mt-4"> Add Row </button>
    <button
      on:click={createOpportunity}
      class="btn btn-primary mt-4"
      disabled={isLoading}
    >
      {selectedOpportunity ? "Save Changes" : "Submit Opportunities"}
    </button>
  </div>
</div>
