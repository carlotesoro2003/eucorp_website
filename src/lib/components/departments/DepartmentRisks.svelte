<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";

  interface Risk {
    id?: string; // UUID is optional until saved
    rrn: string;
    risk_statement: string;
    classification: number | null;
    actions: string;
    key_persons: string;
    budget: number;
    profile_id: string;
    department_id: string; // Add department_id to the Risk interface
  }

  interface Classification {
    id: number;
    name: string;
  }

  let risks: Risk[] = [];
  let classification: Classification[] = [];
  let profile: any = null;
  let departmentName = "";
  let isLoading = true;
  let successMessage: string | null = null;
  let errorMessage: string | null = null;
  let nextRrnNumber = 1;

  // Fetch Profile and Classification Data
  const fetchUserProfile = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      const userId = sessionData?.session?.user?.id;
      if (!userId) throw new Error("No logged-in user found.");

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, department_id")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;
      profile = profileData;

      const { data: departmentData, error: departmentError } = await supabase
        .from("departments")
        .select("name")
        .eq("id", profile.department_id)
        .single();

      if (departmentError) throw departmentError;
      departmentName = departmentData.name;

      await fetchRisks();
      await fetchNextRrnNumber();
      await fetchClassification();
    } catch (error) {
      console.error("Error fetching user profile or department:", error);
      errorMessage = "Failed to fetch profile or department details.";
    }
  };

  const fetchClassification = async () => {
    try {
      const { data, error } = await supabase.from("classification").select("id, name");
      if (error) throw error;
      classification = data || [];
    } catch (error) {
      console.error("Error fetching classifications:", error);
      errorMessage = "Failed to fetch classifications.";
    }
  };

  const fetchRisks = async () => {
    try {
      const { data, error } = await supabase
        .from("risks")
        .select("*")
        .eq("profile_id", profile?.id)
        .order("rrn", { ascending: true });
      if (error) throw error;

      risks = data || [];
    } catch (error) {
      console.error("Error fetching risks:", error);
      errorMessage = "Failed to fetch risks.";
    }
  };

  const fetchNextRrnNumber = async () => {
    try {
      const { data, error } = await supabase
        .from("risks")
        .select("rrn")
        .eq("profile_id", profile?.id)
        .order("rrn", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data.length > 0) {
        const lastRrn = data[0].rrn;
        const lastNumberMatch = lastRrn.match(/(\d+)$/);
        nextRrnNumber = lastNumberMatch ? parseInt(lastNumberMatch[0], 10) + 1 : 1;
      } else {
        nextRrnNumber = 1;
      }
    } catch (error) {
      console.error("Error fetching next RRN number:", error);
      errorMessage = "Failed to determine the next RRN number.";
    }
  };

  const addRow = () => {
    const formattedRrn = `RRN-${departmentName}-${String(nextRrnNumber).padStart(3, "0")}`;
    nextRrnNumber++;
    risks = [
      ...risks,
      {
        rrn: formattedRrn,
        risk_statement: "",
        classification: null,
        actions: "",
        key_persons: "",
        budget: 0,
        profile_id: profile?.id || "",
        department_id: profile?.department_id || "", // Include department_id
      },
    ];
  };

  const removeRow = (index: number) => {
    if (risks.length > 0 && index === risks.length - 1) {
      nextRrnNumber--;
    }
    risks = risks.filter((_, i) => i !== index);
  };

  const saveRisks = async () => {
    try {
      const sanitizedRisks = risks.map(({ id, ...risk }) => risk); // Exclude id during upsert
      const { data, error } = await supabase.from("risks").upsert(sanitizedRisks, { onConflict: "rrn" });
      if (error) throw error;

      // Update IDs in the `risks` array after saving
      const updatedRisks = await supabase
        .from("risks")
        .select("*")
        .eq("profile_id", profile?.id);

      if (updatedRisks.error) throw updatedRisks.error;

      risks = updatedRisks.data || [];
      successMessage = "Risks saved successfully!";
    } catch (error) {
      console.error("Error saving risks:", error);
      errorMessage = "Failed to save risks.";
    }
  };

  onMount(async () => {
    isLoading = true;
    await fetchUserProfile();
    isLoading = false;
  });
</script>

<div class="container mx-auto p-4">
  <h1 class="text-3xl font-bold mb-4">{departmentName} Risks Register</h1>

  {#if successMessage}
    <div class="alert alert-success shadow-lg mb-4">
      <span>{successMessage}</span>
    </div>
  {/if}
  {#if errorMessage}
    <div class="alert alert-error shadow-lg mb-4">
      <span>{errorMessage}</span>
    </div>
  {/if}

  <div class="overflow-x-auto">
    <table class="table table-zebra w-full">
      <thead>
        <tr>
          <th>RRN</th>
          <th>Risk Statement</th>
          <th>Classification</th>
          <th>Actions</th>
          <th>Key Persons</th>
          <th>Budget</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody>
        {#each risks as risk, index}
          <tr>
            <td>{risk.rrn}</td>
            <td>
              <textarea bind:value={risk.risk_statement} class="textarea textarea-bordered w-full"></textarea>
            </td>
            <td>
              <select bind:value={risk.classification} class="select select-bordered w-full">
                <option value={null}>Select classification</option>
                {#each classification as cls}
                  <option value={cls.id}>{cls.name}</option>
                {/each}
              </select>
            </td>
            <td>
              <textarea bind:value={risk.actions} class="textarea textarea-bordered w-full"></textarea>
            </td>
            <td>
              <textarea bind:value={risk.key_persons} class="textarea textarea-bordered w-full"></textarea>
            </td>
            <td>
              <input type="number" bind:value={risk.budget} class="input input-bordered w-full" />
            </td>
            <td>
              <button class="btn btn-error btn-sm" on:click={() => removeRow(index)}>Remove</button>
            </td>
            <td>
              <a
              class="btn btn-info btn-sm"
              href={`/risks/riskAssessment?riskId=${risk.id}`}
              target="_self"
              aria-disabled={!risk.id}
              class:disabled={!risk.id}
              >
              Go to Risk Assessment
              </a>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div class="mt-4 flex gap-4">
    <button class="btn btn-primary" on:click={addRow}>Add New Risk</button>
    <button class="btn btn-success" on:click={saveRisks}>Save All Risks</button>
  </div>
</div>
