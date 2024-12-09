<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import { Download, ArrowUpDown, Search } from "lucide-svelte";
	import jsPDF from "jspdf";
	import autoTable from "jspdf-autotable";

	interface ActionPlan {
		id: number;
		actions_taken: string;
		kpi: string;
		target_output: string;
		key_person_responsible: string;
		created_at: string;
		objective_id: number;
		is_approved: boolean;
		is_approved_vp: boolean;
		is_approved_president: boolean;
		profile_id: string | null;
		department_name: string | null;
		user_name: string | null;
	}

	let actionPlans: ActionPlan[] = [];
	let displayedActionPlans: ActionPlan[] = [];
	let departments: { id: string; name: string }[] = [];
	let searchQuery: string = "";
	let selectedDepartment: string | "all" = "all";
	let statusFilter: "all" | "approved" | "notApproved" = "all";
	let currentUserRole: string | null = null;
	let isLoading = false;
	let showAlert = false;
	let alertType = "";
	let alertMessage = "";

	// Fetch data on mount
	const init = async () => {
		isLoading = true;
		await fetchCurrentUserRole();
		await fetchActionPlans();
		await fetchDepartments();
		isLoading = false;
	};

	// Fetch current user role
	const fetchCurrentUserRole = async () => {
		const { data, error } = await supabase.auth.getSession();
		if (error || !data?.session?.user) return;
		const user = data.session.user;

		const { data: roleData } = await supabase
			.from("profiles")
			.select("role")
			.eq("id", user.id)
			.single();

		currentUserRole = roleData?.role || null;
	};

	// Fetch action plans
	const fetchActionPlans = async () => {
		const { data, error } = await supabase
			.from("action_plans")
			.select(`
				*,
				profiles (
					first_name,
					last_name,
					departments (name)
				)
			`);

		if (error) {
			console.error("Error fetching action plans:", error);
			return;
		}

		actionPlans = data.map((plan: any) => ({
			id: plan.id,
			actions_taken: plan.actions_taken,
			kpi: plan.kpi,
			target_output: plan.target_output,
			key_person_responsible: plan.key_person_responsible,
			created_at: plan.created_at,
			objective_id: plan.objective_id,
			is_approved: plan.is_approved,
			is_approved_vp: plan.is_approved_vp,
			is_approved_president: plan.is_approved_president,
			profile_id: plan.profile_id,
			department_name: plan.profiles?.departments?.name || "Unknown",
			user_name: `${plan.profiles?.first_name || ""} ${plan.profiles?.last_name || ""}`,
		}));
		applyFilters();
	};

	// Fetch departments
	const fetchDepartments = async () => {
		const { data, error } = await supabase.from("departments").select("id, name");
		if (error) {
			console.error("Error fetching departments:", error);
			return;
		}
		departments = data;
	};

	// Apply filters
	const applyFilters = () => {
		displayedActionPlans = actionPlans.filter((plan) => {
			const matchesSearch = `${plan.actions_taken} ${plan.kpi} ${plan.department_name}`
				.toLowerCase()
				.includes(searchQuery.toLowerCase());
			const matchesDepartment =
				selectedDepartment === "all" || plan.department_name === selectedDepartment;
			const matchesStatus =
				statusFilter === "all" ||
				(statusFilter === "approved" ? plan.is_approved : !plan.is_approved);

			return matchesSearch && matchesDepartment && matchesStatus;
		});
	};

	// Approve action plan
	const approveActionPlan = async (planId: number) => {
		let updateField: Partial<ActionPlan> = {};
		if (currentUserRole === "admin") updateField = { is_approved: true };
		else if (currentUserRole === "vice_president") updateField = { is_approved_vp: true };
		else if (currentUserRole === "president") updateField = { is_approved_president: true };

		await supabase.from("action_plans").update(updateField).eq("id", planId);
		await fetchActionPlans();
	};

	// Export to PDF
	const exportToPDF = () => {
		const doc = new jsPDF("landscape");
		const columns = [
			"Department",
			"Actions Taken",
			"KPI",
			"Target Output",
			"Key Person Responsible",
		];
		const rows = displayedActionPlans.map((plan) => [
			plan.department_name,
			plan.actions_taken,
			plan.kpi,
			plan.target_output,
			plan.key_person_responsible,
		]);
		doc.text("Action Plans Report", 14, 15);
		autoTable(doc, { head: [columns], body: rows, startY: 25 });
		doc.save("ActionPlans.pdf");
	};

	// Initialize data
	init();
</script>

<div class="flex flex-col gap-4 container mx-auto p-4">
	{#if showAlert}
		<div class="alert alert-{alertType} shadow-lg mb-4">
			<div>
				<span>{alertMessage}</span>
			</div>
		</div>
	{/if}

	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<h2 class="text-2xl font-bold">Action Plans Management</h2>
	</div>

	<!-- Filters -->
	<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div class="relative flex-1 md:w-[300px]">
			<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
			<input type="text" bind:value={searchQuery} placeholder="Search action plans..." class="pl-10 pr-4 py-2 bg-secondary border-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring" oninput={applyFilters} />
		</div>
		<select bind:value={selectedDepartment} class="bg-secondary border-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-full md:w-[150px]" onchange={applyFilters}>
			<option value="all">All Departments</option>
			{#each departments as department}
				<option value={department.name}>{department.name}</option>
			{/each}
		</select>
		<select bind:value={statusFilter} class="bg-secondary border-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-full md:w-[150px]" onchange={applyFilters}>
			<option value="all">All Status</option>
			<option value="approved">Approved</option>
			<option value="notApproved">Not Approved</option>
		</select>
		<button onclick={exportToPDF} class="btn btn-secondary flex items-center gap-2">
			<Download size={16} />
			Export to PDF
		</button>
	</div>

	<!-- Table -->
	{#if isLoading}
		<div class="flex justify-center p-8">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
		</div>
	{:else}
		<div class="overflow-x-auto bg-card rounded-lg shadow border border-border">
			<table class="min-w-full table-auto">
				<thead class="bg-muted/50">
					<tr>
						<th class="px-4 py-3 text-left">Department</th>
						<th class="px-4 py-3 text-left">Actions Taken</th>
						<th class="px-4 py-3 text-left">KPI</th>
						<th class="px-4 py-3 text-left">Target Output</th>
						<th class="px-4 py-3 text-left">Key Person</th>
						<th class="px-4 py-3 text-left">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each displayedActionPlans as plan}
						<tr>
							<td>{plan.department_name}</td>
							<td>{plan.actions_taken}</td>
							<td>{plan.kpi}</td>
							<td>{plan.target_output}</td>
							<td>{plan.key_person_responsible}</td>
							<td class="flex gap-2">
								<button
									class="btn btn-success btn-sm"
									onclick={() => approveActionPlan(plan.id)}
									disabled={plan.is_approved}
								>
									{plan.is_approved ? "Approved" : "Approve"}
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
