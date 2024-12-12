<script lang="ts">
	import { onMount } from "svelte";
	import { Plus, Save, Target } from "lucide-svelte";
	import RiskCard from "$lib/components/dept-risks-table/RiskCard.svelte";
	import Loading from "$lib/components/dept-risks-table/Loading.svelte";
	import Alerts from "$lib/components/dept-risks-table/Alerts.svelte";
	import { supabase } from "$lib/supabaseClient";
	import { fade } from "svelte/transition";

	interface Risk {
		id?: string;
		rrn: string;
		risk_statement: string;
		classification: number | null;
		actions: string;
		key_persons: string;
		budget: number;
		profile_id: string;
		department_id: string;
	}

	interface Classification {
		id: number;
		name: string;
	}

	let risks: Risk[] = $state([]);
	let classification: Classification[] = $state([]);
	let profile: any = $state(null);
	let departmentName: string = $state("");
	let isLoading: boolean = $state(true);
	let isSaving: boolean = $state(false);
	let successMessage: string | null = $state(null);
	let errorMessage: string | null = $state(null);
	let nextRrnNumber: number = $state(1);

	/** Function to fetch profile,risks,classification */
	const fetchAllData = async () => {
		try {
			await fetchUserProfile();
			await fetchRisks();
			await fetchNextRrnNumber();
			await fetchClassification();
		} catch (error) {
			console.error("Error fetching data:", error);
			errorMessage = "Failed to fetch data. Please try again.";
		}
	};

	/** Function to fetch user profile */
	const fetchUserProfile = async () => {
		try {
			const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
			if (sessionError) throw sessionError;

			const userId = sessionData?.session?.user?.id;
			if (!userId) throw new Error("No logged-in user found.");

			const { data: profileData, error: profileError } = await supabase.from("profiles").select("id, department_id").eq("id", userId).single();

			if (profileError) throw profileError;
			profile = profileData;

			const { data: departmentData, error: departmentError } = await supabase.from("departments").select("name").eq("id", profile.department_id).single();

			if (departmentError) throw departmentError;
			departmentName = departmentData.name;
		} catch (error) {
			console.error("Error fetching user profile:", error);
			errorMessage = "Failed to fetch profile details.";
		}
	};

	/** Function to fetch classification */
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

	/** Function to fetch risks */
	const fetchRisks = async () => {
		try {
			const { data, error } = await supabase.from("risks").select("*").eq("department_id", profile?.department_id).order("rrn", { ascending: true });
			if (error) throw error;

			risks = data || [];
		} catch (error) {
			console.error("Error fetching risks:", error);
			errorMessage = "Failed to fetch risks.";
		}
	};

	/** Function to fetch next RRN number */
	const fetchNextRrnNumber = async () => {
		try {
			const { data, error } = await supabase.from("risks").select("rrn").eq("profile_id", profile?.id).order("rrn", { ascending: false }).limit(1);

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

	/** Add new risk row */
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
				department_id: profile?.department_id || "",
			},
		];
	};

	/** Remove risk row */
	const removeRow = (index: number) => {
		if (risks.length > 0 && index === risks.length - 1) {
			nextRrnNumber--;
		}
		risks = risks.filter((_, i) => i !== index);
	};

	/** Save all risks */
	const saveRisks = async () => {
		isSaving = true;
		try {
			const sanitizedRisks = risks.map(({ id, ...risk }) => risk);
			const { error } = await supabase.from("risks").upsert(sanitizedRisks, { onConflict: "rrn" });
			if (error) throw error;

			const updatedRisks = await supabase.from("risks").select("*").eq("profile_id", profile?.id);

			if (updatedRisks.error) throw updatedRisks.error;

			risks = updatedRisks.data || [];
			successMessage = "Risks saved successfully!";
			setTimeout(() => {
				successMessage = null;
			}, 3000);
		} catch (error) {
			console.error("Error saving risks:", error);
			errorMessage = "Failed to save risks.";
			setTimeout(() => {
				errorMessage = null;
			}, 3000);
		} finally {
			isSaving = false;
		}
	};

	onMount(async () => {
		isLoading = true;
		await fetchAllData();
		isLoading = false;
	});
</script>

<div class="flex flex-col gap-4 p-4 container mx-auto">
	<!-- Alerts -->
	{#if successMessage}
		<div transition:fade class="flex items-center p-4 rounded-lg bg-green-100 text-green-800">
			<span>{successMessage}</span>
		</div>
	{/if}
	{#if errorMessage}
		<div transition:fade class="flex items-center p-4 rounded-lg bg-red-100 text-red-800">
			<span>{errorMessage}</span>
		</div>
	{/if}

	<!-- Header -->
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<div class="flex items-center gap-2">
			<Target class="w-8 h-8 text-primary" />
			<h1 class="text-2xl font-bold">{departmentName} Risk Register</h1>
		</div>
		<div class="flex gap-2">
			<button onclick={addRow} class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
				<Plus size={20} />
				Add Risk
			</button>
			<button onclick={saveRisks} disabled={isSaving} class="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50">
				<Save size={20} />
				{isSaving ? "Saving..." : "Save All"}
			</button>
		</div>
	</div>

	<!-- Content -->
	{#if isLoading}
		<div class="flex justify-center p-8">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-4">
			{#each risks as risk, index}
				<RiskCard {risk} {classification} {index} {removeRow} />
			{/each}
		</div>
	{/if}
</div>
