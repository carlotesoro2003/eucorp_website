import { N as spread_props, O as slot, P as sanitize_props, A as push, L as escape_html, F as attr, C as pop, Q as ensure_array_like, R as stringify, G as bind_props } from "../../../chunks/index.js";
import { s as supabase } from "../../../chunks/supabaseClient.js";
import { P as Pencil } from "../../../chunks/pencil.js";
import { T as Trash_2 } from "../../../chunks/trash-2.js";
import "jspdf";
import "jspdf-autotable";
import { L as Lightbulb } from "../../../chunks/lightbulb.js";
import { A as Arrow_up_down } from "../../../chunks/arrow-up-down.js";
import { S as Search } from "../../../chunks/search.js";
import { D as Download } from "../../../chunks/download.js";
import { X } from "../../../chunks/x.js";
import { S as Save } from "../../../chunks/save.js";
import { P as Plus } from "../../../chunks/plus.js";
import { I as Icon } from "../../../chunks/Icon.js";
function Circle_plus($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "circle",
      { "cx": "12", "cy": "12", "r": "10" }
    ],
    ["path", { "d": "M8 12h8" }],
    ["path", { "d": "M12 8v8" }]
  ];
  Icon($$payload, spread_props([
    { name: "circle-plus" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function TableRow($$payload, $$props) {
  push();
  let {
    opportunity,
    userRole,
    onEdit,
    onDelete,
    onApprove,
    approvingId,
    deletingId
  } = $$props;
  $$payload.out += `<tr class="hover:bg-muted/50"><td class="px-4 py-3">${escape_html(opportunity.opt_statement)}</td><td class="px-4 py-3">${escape_html(opportunity.planned_actions)}</td><td class="px-4 py-3">${escape_html(opportunity.kpi)}</td><td class="px-4 py-3">${escape_html(opportunity.key_persons)}</td><td class="px-4 py-3">${escape_html(opportunity.target_output)}</td><td class="px-4 py-3">P${escape_html(opportunity.budget.toFixed(2))}</td><td class="px-4 py-3">${escape_html(opportunity.department_name)}</td><td class="px-4 py-3"><div class="flex items-center gap-2"><button${attr("disabled", approvingId === opportunity.id || userRole === "admin" && opportunity.is_approved || userRole === "vice_president" && (!opportunity.is_approved || opportunity.is_approved_vp) || userRole === "president" && (!opportunity.is_approved_vp || opportunity.is_approved_president), true)} class="px-2 py-1 text-sm rounded bg-green-500 text-white hover:bg-green-600 disabled:opacity-50">${escape_html(approvingId === opportunity.id ? "Processing..." : userRole === "admin" ? opportunity.is_approved ? "Admin Approved" : "Approve" : userRole === "vice_president" ? opportunity.is_approved_vp ? "VP Approved" : "Approve" : userRole === "president" ? opportunity.is_approved_president ? "President Approved" : "Approve" : "Approve")}</button> <button class="hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground">`;
  Pencil($$payload, { size: 16 });
  $$payload.out += `<!----></button> <button${attr("disabled", deletingId === opportunity.id, true)} class="p-1 rounded hover:bg-muted text-red-500 hover:text-red-600 disabled:opacity-50">`;
  Trash_2($$payload, { size: 16 });
  $$payload.out += `<!----></button></div></td></tr>`;
  pop();
}
function OpportunityForm($$payload, $$props) {
  push();
  let { opportunity, onSave, saving } = $$props;
  let formData = opportunity ? { ...opportunity } : {
    opt_statement: "",
    planned_actions: "",
    kpi: "",
    key_persons: "",
    target_output: "",
    budget: 0
  };
  $$payload.out += `<form class="h-full max-h-screen flex flex-col gap-4 p-4"><h3 class="text-lg font-semibold">Edit Opportunity</h3> <div class="flex-1 overflow-y-auto pr-2"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="space-y-4"><div class="space-y-2"><label for="opt_statement">Statement</label> <textarea id="opt_statement" class="w-full p-2 border rounded-lg bg-background min-h-[100px] overflow-hidden">`;
  const $$body = escape_html(formData.opt_statement);
  if ($$body) {
    $$payload.out += `${$$body}`;
  }
  $$payload.out += `</textarea></div> <div class="space-y-2"><label for="planned_actions">Planned Actions</label> <textarea id="planned_actions" class="w-full p-2 border rounded-lg bg-background min-h-[100px] overflow-hidden">`;
  const $$body_1 = escape_html(formData.planned_actions);
  if ($$body_1) {
    $$payload.out += `${$$body_1}`;
  }
  $$payload.out += `</textarea></div></div> <div class="space-y-4"><div class="space-y-2"><label for="kpi">KPI</label> <textarea id="kpi" class="w-full p-2 border rounded-lg bg-background min-h-[42px] overflow-hidden">`;
  const $$body_2 = escape_html(formData.kpi);
  if ($$body_2) {
    $$payload.out += `${$$body_2}`;
  }
  $$payload.out += `</textarea></div> <div class="space-y-2"><label for="key_persons">Key Persons</label> <textarea id="key_persons" class="w-full p-2 border rounded-lg bg-background min-h-[42px] overflow-hidden">`;
  const $$body_3 = escape_html(formData.key_persons);
  if ($$body_3) {
    $$payload.out += `${$$body_3}`;
  }
  $$payload.out += `</textarea></div> <div class="space-y-2"><label for="target_output">Target Output</label> <textarea id="target_output" class="w-full p-2 border rounded-lg bg-background min-h-[42px] overflow-hidden">`;
  const $$body_4 = escape_html(formData.target_output);
  if ($$body_4) {
    $$payload.out += `${$$body_4}`;
  }
  $$payload.out += `</textarea></div> <div class="space-y-2"><label for="budget">Budget</label> <input type="number" id="budget"${attr("value", formData.budget)} class="w-full p-2 border rounded-lg bg-background" min="0" step="0.01"></div></div></div></div> <div class="sticky bottom-0 flex justify-end gap-2 pt-4 border-t bg-background"><button type="submit"${attr("disabled", saving, true)} class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50">${escape_html(saving ? "Saving..." : "Save Changes")}</button></div></form>`;
  pop();
}
function AdminOpportunities($$payload, $$props) {
  push();
  let searchQuery = "";
  let currentPage = 1;
  let itemsPerPage = 5;
  let showForm = false;
  let editingOpportunity = null;
  let sortField = "opt_statement";
  let departmentFilter = "all";
  let showAlert = false;
  let alertMessage = "";
  let alertType = "success";
  let saving = false;
  let loading = true;
  let approvingId = null;
  let deletingId = null;
  let opportunities = [];
  let departments = [];
  let userRole = null;
  const init = async () => {
    await fetchCurrentUserRole();
    await fetchAdminName();
    await fetchOpportunities();
    await fetchDepartments();
    await fetchVPAndPresidentNames();
    loading = false;
  };
  const fetchCurrentUserRole = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) return;
    const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
    if (error) {
      displayAlert("Error fetching user role: " + error.message, "error");
      return;
    }
    userRole = profile.role;
  };
  const fetchAdminName = async () => {
    const { data, error } = await supabase.from("profiles").select("first_name, last_name").eq("role", "admin");
    if (error) {
      displayAlert("Error fetching admin name: " + error.message, "error");
      return;
    }
    data.map((admin) => `${admin.first_name} ${admin.last_name}`).join(", ");
  };
  const fetchVPAndPresidentNames = async () => {
    const { data, error } = await supabase.from("profiles").select("first_name, last_name, role").in("role", ["vice_president", "president"]);
    if (error) {
      displayAlert("Error fetching VP and President names: " + error.message, "error");
      return;
    }
    const vp = data.find((user) => user.role === "vice_president");
    const president = data.find((user) => user.role === "president");
    vp ? `${vp.first_name} ${vp.last_name}` : "N/A";
    president ? `${president.first_name} ${president.last_name}` : "N/A";
  };
  const fetchOpportunities = async () => {
    const { data, error } = await supabase.from("opportunities").select(`
                *,
                profiles (
                    first_name,
                    last_name,
                    departments (name)
                )
            `);
    if (error) {
      displayAlert("Error fetching opportunities: " + error.message, "error");
      return;
    }
    opportunities = data.map((opportunity) => ({
      ...opportunity,
      department_name: opportunity.profiles?.departments?.name || "N/A",
      user_name: `${opportunity.profiles?.first_name || ""} ${opportunity.profiles?.last_name || ""}`
    }));
  };
  const fetchDepartments = async () => {
    const { data, error } = await supabase.from("departments").select("id, name");
    if (error) {
      displayAlert("Error fetching departments: " + error.message, "error");
      return;
    }
    departments = data;
  };
  const displayAlert = (message, type) => {
    alertMessage = message;
    alertType = type;
    showAlert = true;
    setTimeout(
      () => {
        showAlert = false;
      },
      3e3
    );
  };
  const filteredItems = opportunities.filter((opportunity) => {
    const searchFields = `${opportunity.opt_statement} ${opportunity.planned_actions} ${opportunity.department_name}`.toLowerCase();
    const matchesSearch = searchFields.includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === "all";
    return matchesSearch && matchesDepartment;
  }).sort((a, b) => {
    const aValue = String(a[sortField]);
    const bValue = String(b[sortField]);
    return aValue.localeCompare(bValue);
  });
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const deleteOpportunity = async (id) => {
    deletingId = id;
    const { error } = await supabase.from("opportunities").delete().eq("id", id);
    if (error) {
      displayAlert("Error deleting opportunity: " + error.message, "error");
    } else {
      await fetchOpportunities();
      displayAlert("Opportunity deleted successfully!", "success");
    }
    deletingId = null;
  };
  const approveOpportunity = async (id) => {
    approvingId = id;
    let updateField = {};
    if (userRole === "admin") {
      updateField = { is_approved: true };
    } else if (userRole === "vice_president") {
      updateField = { is_approved_vp: true };
    } else if (userRole === "president") {
      updateField = { is_approved_president: true };
    }
    const { data, error } = await supabase.from("opportunities").update(updateField).eq("id", id).select();
    if (error) {
      displayAlert("Error approving opportunity: " + error.message, "error");
    } else {
      if (userRole === "president" && data && data.length > 0) {
        const opportunity = data[0];
        const { error: monitoringError } = await supabase.from("opt_monitoring").insert({
          opt_id: opportunity.id,
          profile_id: opportunity.profile_id,
          department_id: opportunity.department_id
        });
        if (monitoringError) {
          displayAlert("Error adding to monitoring: " + monitoringError.message, "error");
        }
      }
      await fetchOpportunities();
      displayAlert("Opportunity approved successfully!", "success");
    }
    approvingId = null;
  };
  const saveOpportunity = async (formData) => {
    if (!editingOpportunity) return;
    saving = true;
    const { error } = await supabase.from("opportunities").update({
      opt_statement: formData.opt_statement,
      planned_actions: formData.planned_actions,
      kpi: formData.kpi,
      key_persons: formData.key_persons,
      target_output: formData.target_output,
      budget: formData.budget
    }).eq("id", editingOpportunity.id);
    if (error) {
      displayAlert("Error updating opportunity: " + error.message, "error");
    } else {
      await fetchOpportunities();
      displayAlert("Opportunity updated successfully!", "success");
      closeForm();
    }
    saving = false;
  };
  const closeForm = () => {
    showForm = false;
    editingOpportunity = null;
  };
  init();
  const each_array = ensure_array_like(departments);
  $$payload.out += `<div class="flex flex-col gap-4 container mx-auto p-6">`;
  if (showAlert) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div${attr("class", `alert alert-${stringify(alertType)} shadow-lg mb-4`)}><span>${escape_html(alertMessage)}</span></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><div class="flex items-center gap-2">`;
  Lightbulb($$payload, { class: "w-8 h-8 text-primary" });
  $$payload.out += `<!----> <h1 class="text-2xl font-bold">Opportunities Management</h1></div></div> <button class="md:hidden w-full px-4 py-2 bg-secondary rounded-lg text-left flex justify-between items-center">Filters `;
  Arrow_up_down($$payload, {
    size: 16,
    class: ""
  });
  $$payload.out += `<!----></button> <div${attr("class", `flex flex-col gap-4 ${"hidden"} md:flex md:flex-row md:justify-between`)}><div class="flex flex-col md:flex-row gap-4 w-full md:w-auto"><div class="relative flex-1 md:w-[300px]">`;
  Search($$payload, {
    class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground",
    size: 20
  });
  $$payload.out += `<!----> <input type="text"${attr("value", searchQuery)} placeholder="Search opportunities..." class="pl-10 pr-4 py-2 bg-secondary border-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring"></div> <select class="bg-secondary rounded-lg px-3 py-2 w-full md:w-[200px]"><option value="all">All Departments</option><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let department = each_array[$$index];
    $$payload.out += `<option${attr("value", department.name)}>${escape_html(department.name)}</option>`;
  }
  $$payload.out += `<!--]--></select></div> <div class="flex gap-2 w-full md:w-auto">`;
  if (paginatedItems.length > 0) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<button class="flex items-center gap-2 bg-secondary px-4 py-2 rounded-lg hover:bg-secondary/80 flex-1 md:flex-initial">`;
    Download($$payload, { size: 20 });
    $$payload.out += `<!----> Export</button> <button class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"${attr("disabled", paginatedItems.every((opportunity) => userRole === "admin" && opportunity.is_approved || userRole === "vice_president" && opportunity.is_approved_vp || userRole === "president" && opportunity.is_approved_president), true)}>${escape_html("Approve All")}</button>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div></div> `;
  if (loading) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center p-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    const each_array_1 = ensure_array_like(paginatedItems);
    $$payload.out += `<div class="overflow-x-auto bg-card rounded-lg shadow border border-border"><table class="min-w-full table-auto"><thead class="bg-muted/50"><tr><th class="px-4 py-3 text-left"><button class="flex items-center gap-1 hover:text-primary">Statement `;
    Arrow_up_down($$payload, {
      size: 16,
      class: "text-primary"
    });
    $$payload.out += `<!----></button></th><th class="px-4 py-3 text-left"><button class="flex items-center gap-1 hover:text-primary">Actions `;
    Arrow_up_down($$payload, {
      size: 16,
      class: ""
    });
    $$payload.out += `<!----></button></th><th class="px-4 py-3 text-left">KPI</th><th class="px-4 py-3 text-left">Key Persons</th><th class="px-4 py-3 text-left">Target</th><th class="px-4 py-3 text-left"><button class="flex items-center gap-1 hover:text-primary">Budget `;
    Arrow_up_down($$payload, {
      size: 16,
      class: ""
    });
    $$payload.out += `<!----></button></th><th class="px-4 py-3 text-left"><button class="flex items-center gap-1 hover:text-primary">Department `;
    Arrow_up_down($$payload, {
      size: 16,
      class: ""
    });
    $$payload.out += `<!----></button></th><th class="px-4 py-3 text-left w-[150px]">Actions</th></tr></thead><tbody class="divide-y divide-border"><!--[-->`;
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let opportunity = each_array_1[$$index_1];
      TableRow($$payload, {
        opportunity,
        userRole,
        onEdit: (opp) => {
          editingOpportunity = opp;
          showForm = true;
        },
        onDelete: deleteOpportunity,
        onApprove: approveOpportunity,
        approvingId,
        deletingId
      });
    }
    $$payload.out += `<!--]--></tbody></table></div> <div class="flex flex-col sm:flex-row justify-between items-center gap-4"><div class="text-sm text-muted-foreground">Showing ${escape_html((currentPage - 1) * itemsPerPage + 1)} to ${escape_html(Math.min(currentPage * itemsPerPage, filteredItems.length))} of ${escape_html(filteredItems.length)} results</div> <div class="flex flex-col sm:flex-row items-center gap-4"><select class="bg-secondary rounded-lg px-2 py-1 w-full sm:w-auto"><option${attr("value", 5)}>5 per page</option><option${attr("value", 10)}>10 per page</option><option${attr("value", 25)}>25 per page</option><option${attr("value", 50)}>50 per page</option></select> <div class="flex gap-2"><button${attr("disabled", currentPage === 1, true)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Previous</button> <button${attr("disabled", currentPage === totalPages, true)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Next</button></div></div></div>`;
  }
  $$payload.out += `<!--]--> `;
  if (showForm) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"><div class="bg-card p-3 rounded-lg w-full max-w-md relative border border-border"><button class="absolute right-4 top-4 p-1 hover:bg-muted rounded-lg">`;
    X($$payload, { size: 20 });
    $$payload.out += `<!----></button> `;
    OpportunityForm($$payload, {
      opportunity: editingOpportunity,
      onSave: saveOpportunity,
      saving
    });
    $$payload.out += `<!----></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
function OpportunityCard($$payload, $$props) {
  push();
  let { data, index, onDelete } = $$props;
  $$payload.out += `<div class="bg-gray-50 rounded-lg p-6 border border-gray-200"><div class="flex justify-between items-start mb-4"><h3 class="text-lg font-semibold text-gray-700">Opportunity ${escape_html(index + 1)}</h3> <button class="text-red-500 hover:text-red-700 transition-colors p-2">`;
  Trash_2($$payload, { class: "w-5 h-5" });
  $$payload.out += `<!----></button></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-1">Opportunity Statement</label> <textarea placeholder="Describe the opportunity..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="3">`;
  const $$body = escape_html(data.opt_statement);
  if ($$body) {
    $$payload.out += `${$$body}`;
  }
  $$payload.out += `</textarea></div> <div><label class="block text-sm font-medium text-gray-700 mb-1">Planned Actions</label> <textarea placeholder="List planned actions..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="3">`;
  const $$body_1 = escape_html(data.planned_actions);
  if ($$body_1) {
    $$payload.out += `${$$body_1}`;
  }
  $$payload.out += `</textarea></div> <div><label class="block text-sm font-medium text-gray-700 mb-1">KPI</label> <textarea placeholder="Key Performance Indicators..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="2">`;
  const $$body_2 = escape_html(data.kpi);
  if ($$body_2) {
    $$payload.out += `${$$body_2}`;
  }
  $$payload.out += `</textarea></div></div> <div class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-1">Key Persons</label> <textarea placeholder="List key persons involved..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="2">`;
  const $$body_3 = escape_html(data.key_persons);
  if ($$body_3) {
    $$payload.out += `${$$body_3}`;
  }
  $$payload.out += `</textarea></div> <div><label class="block text-sm font-medium text-gray-700 mb-1">Target Output</label> <textarea placeholder="Expected outcomes..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="2">`;
  const $$body_4 = escape_html(data.target_output);
  if ($$body_4) {
    $$payload.out += `${$$body_4}`;
  }
  $$payload.out += `</textarea></div> <div><label class="block text-sm font-medium text-gray-700 mb-1">Budget</label> <input type="number"${attr("value", data.budget)} placeholder="Enter budget amount..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></div></div></div></div>`;
  pop();
}
function DepartmentOpportunities($$payload, $$props) {
  push();
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
      department_id: ""
    }
  ];
  const deleteCard = (index) => {
    formData.splice(index, 1);
    formData = [...formData];
  };
  $$payload.out += `<div class="flex flex-col gap-4 p-4 container mx-auto">`;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><div class="flex items-center gap-2">`;
  Lightbulb($$payload, { class: "w-8 h-8 text-primary" });
  $$payload.out += `<!----> <h1 class="text-2xl font-bold">Opportunities Register</h1></div></div> <div class="bg-card rounded-lg shadow border border-border p-6"><div class="flex justify-between items-center mb-6"><h2 class="text-xl font-semibold">${escape_html("Create Opportunity")}</h2> <button class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"${attr("disabled", isSaving, true)}>`;
  Save($$payload, { class: "w-4 h-4 mr-2" });
  $$payload.out += `<!----> Save Progress</button></div> `;
  {
    $$payload.out += "<!--[!-->";
    const each_array = ensure_array_like(formData);
    $$payload.out += `<div class="grid grid-cols-1 gap-6 mb-6"><!--[-->`;
    for (let index = 0, $$length = each_array.length; index < $$length; index++) {
      let data = each_array[index];
      OpportunityCard($$payload, {
        data,
        index,
        onDelete: () => deleteCard(index)
      });
    }
    $$payload.out += `<!--]--></div> <div class="flex flex-wrap gap-4"><button class="inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">`;
    Plus($$payload, { class: "w-4 h-4 mr-2" });
    $$payload.out += `<!----> Add New Opportunity</button> <button class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"${attr("disabled", isSaving, true)}>`;
    Circle_plus($$payload, { class: "w-4 h-4 mr-2" });
    $$payload.out += `<!----> `;
    {
      $$payload.out += "<!--[!-->";
      $$payload.out += `${escape_html("Submit Opportunities")}`;
    }
    $$payload.out += `<!--]--></button></div>`;
  }
  $$payload.out += `<!--]--></div></div>`;
  pop();
}
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  const { session } = data;
  let profile = null;
  let loading = true;
  const fetchUserProfile = async () => {
    if (session) {
      const { user } = session;
      const { data: data2, error } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (error) {
        console.error("Error fetching user profile:", error.message);
      } else {
        profile = data2;
        console.log("Role in Opportunities: ", profile);
      }
    }
    loading = false;
  };
  fetchUserProfile();
  $$payload.out += `<div>`;
  if (loading) {
    $$payload.out += "<!--[-->";
  } else {
    $$payload.out += "<!--[!-->";
    if (session !== null && profile) {
      $$payload.out += "<!--[-->";
      if (profile.role === "admin" || profile.role == "vice_president" || profile.role == "president") {
        $$payload.out += "<!--[-->";
        AdminOpportunities($$payload);
      } else {
        $$payload.out += "<!--[!-->";
        DepartmentOpportunities($$payload);
      }
      $$payload.out += `<!--]-->`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
