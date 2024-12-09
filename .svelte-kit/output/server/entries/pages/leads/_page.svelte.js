import { P as spread_props, Q as slot, R as sanitize_props, A as push, L as escape_html, F as attr, C as pop, N as ensure_array_like } from "../../../chunks/index.js";
import { s as supabase } from "../../../chunks/supabaseClient.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { P as Pencil } from "../../../chunks/pencil.js";
import { T as Trash_2 } from "../../../chunks/trash-2.js";
import { S as Search } from "../../../chunks/search.js";
import { A as Arrow_up_down } from "../../../chunks/arrow-up-down.js";
import { P as Plus } from "../../../chunks/plus.js";
import { X } from "../../../chunks/x.js";
function User($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
      }
    ],
    [
      "circle",
      { "cx": "12", "cy": "7", "r": "4" }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "user" },
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
function LeadForm($$payload, $$props) {
  push();
  let { lead, onSave } = $$props;
  let name = lead?.name ?? "";
  $$payload.out += `<form class="flex flex-col gap-4"><h3 class="text-xl font-semibold">${escape_html(lead ? "Edit" : "Add")} Lead</h3> <div class="flex flex-col gap-2"><label for="name" class="font-medium">Name</label> <input id="name" type="text"${attr("value", name)} required class="bg-secondary border-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Enter name"></div> <button type="submit" class="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 mt-4">${escape_html(lead ? "Update" : "Add")} Lead</button></form>`;
  pop();
}
function LeadCard($$payload, $$props) {
  push();
  let { lead, onDelete, onEdit } = $$props;
  $$payload.out += `<div class="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-shadow"><div class="flex items-start justify-between"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">`;
  User($$payload, { size: 20 });
  $$payload.out += `<!----></div> <div><h3 class="text-lg font-medium break-words">${escape_html(lead.name)}</h3></div></div> <div class="flex items-center gap-2"><button class="hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground" title="Edit">`;
  Pencil($$payload, { size: 16 });
  $$payload.out += `<!----></button> <button class="p-1.5 hover:bg-muted rounded-lg text-red-400" title="Delete">`;
  Trash_2($$payload, { size: 16 });
  $$payload.out += `<!----></button></div></div></div>`;
  pop();
}
function Table($$payload, $$props) {
  push();
  let searchQuery = "";
  let currentPage = 1;
  let itemsPerPage = 6;
  let leads = [];
  let showForm = false;
  let editingLead = null;
  let isLoading = false;
  let errorMessage = null;
  let successMessage = null;
  const filteredLeads = leads.filter((lead) => lead.name.toLowerCase().includes(searchQuery.toLowerCase())).sort((a, b) => {
    {
      return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
    }
  });
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const fetchLeads = async () => {
    isLoading = true;
    const { data, error } = await supabase.from("leads").select("*");
    if (error) {
      console.error("Error fetching leads:", error);
      errorMessage = "Failed to fetch leads.";
    } else {
      leads = data;
      errorMessage = null;
    }
    isLoading = false;
  };
  const deleteLead = async (id) => {
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) {
      console.error("Error deleting lead:", error);
      errorMessage = "Failed to delete lead.";
    } else {
      successMessage = "Lead deleted successfully!";
      errorMessage = null;
      await fetchLeads();
    }
  };
  const editLead = (lead) => {
    editingLead = lead;
    showForm = true;
  };
  const closeForm = () => {
    showForm = false;
    editingLead = null;
  };
  const handleSave = async (lead) => {
    const { error } = editingLead ? await supabase.from("leads").update({ name: lead.name }).eq("id", editingLead.id) : await supabase.from("leads").insert([{ name: lead.name }]);
    if (error) {
      console.error("Error saving lead:", error);
      errorMessage = "Failed to save lead.";
    } else {
      successMessage = editingLead ? "Lead updated successfully!" : "Lead added successfully!";
      errorMessage = null;
      await fetchLeads();
      closeForm();
    }
  };
  $$payload.out += `<div class="flex flex-col gap-4 container mx-auto"><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><h2 class="text-2xl font-bold">Leads Management</h2></div> `;
  if (successMessage) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="bg-green-500/20 text-green-400 p-4 rounded-lg">${escape_html(successMessage)}</div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (errorMessage) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="bg-red-500/20 text-red-400 p-4 rounded-lg">${escape_html(errorMessage)}</div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="flex flex-col md:flex-row items-center justify-between gap-4"><div class="flex flex-col md:flex-row gap-4 w-full md:w-auto"><div class="relative flex-1 md:w-[300px]">`;
  Search($$payload, {
    class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground",
    size: 20
  });
  $$payload.out += `<!----> <input type="text"${attr("value", searchQuery)} placeholder="Search leads..." class="pl-10 pr-4 py-2 bg-secondary border-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring"></div> <button class="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted whitespace-nowrap">Sort by Name `;
  Arrow_up_down($$payload, {
    size: 16,
    class: ""
  });
  $$payload.out += `<!----></button></div> <button class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 justify-center flex-1 md:flex-initial whitespace-nowrap">`;
  Plus($$payload, { size: 20 });
  $$payload.out += `<!----> Add Lead</button></div> `;
  if (isLoading) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center p-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    if (leads.length === 0) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="text-center p-8 bg-card rounded-lg border border-border">No leads found.</div>`;
    } else {
      $$payload.out += "<!--[!-->";
      const each_array = ensure_array_like(paginatedLeads);
      $$payload.out += `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let lead = each_array[$$index];
        LeadCard($$payload, { lead, onEdit: editLead, onDelete: deleteLead });
      }
      $$payload.out += `<!--]--></div> <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4"><div class="text-sm text-muted-foreground text-center sm:text-left">Showing ${escape_html((currentPage - 1) * itemsPerPage + 1)} to ${escape_html(Math.min(currentPage * itemsPerPage, filteredLeads.length))} of ${escape_html(filteredLeads.length)} results</div> <div class="flex flex-col sm:flex-row items-center gap-4"><select class="bg-secondary border-secondary rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-auto"><option${attr("value", 6)}>6 per page</option><option${attr("value", 12)}>12 per page</option><option${attr("value", 24)}>24 per page</option><option${attr("value", 48)}>48 per page</option></select> <div class="flex gap-2"><button${attr("disabled", currentPage === 1, true)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Previous</button> <button${attr("disabled", currentPage === totalPages, true)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Next</button></div></div></div>`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--> `;
  if (showForm) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"><div class="bg-card p-6 rounded-lg w-full max-w-md relative border border-border"><button class="absolute right-4 top-4 p-1 hover:bg-muted rounded-lg">`;
    X($$payload, { size: 20 });
    $$payload.out += `<!----></button> `;
    LeadForm($$payload, { lead: editingLead, onSave: handleSave });
    $$payload.out += `<!----></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
function _page($$payload, $$props) {
  push();
  $$payload.out += `<main class="container mx-auto min-h-screen p-4">`;
  Table($$payload);
  $$payload.out += `<!----></main>`;
  pop();
}
export {
  _page as default
};
