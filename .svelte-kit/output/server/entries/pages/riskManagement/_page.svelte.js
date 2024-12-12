import { N as spread_props, O as slot, P as sanitize_props, A as push, L as escape_html, F as attr, C as pop, Q as ensure_array_like } from "../../../chunks/index.js";
import { s as supabase } from "../../../chunks/supabaseClient.js";
import { P as Pencil } from "../../../chunks/pencil.js";
import { T as Trash_2 } from "../../../chunks/trash-2.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { P as Plus } from "../../../chunks/plus.js";
import { X } from "../../../chunks/x.js";
function Trending_up($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "polyline",
      { "points": "22 7 13.5 15.5 8.5 10.5 2 17" }
    ],
    ["polyline", { "points": "16 7 22 7 22 13" }]
  ];
  Icon($$payload, spread_props([
    { name: "trending-up" },
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
function RatingForm($$payload, $$props) {
  push();
  let { type, item, onSave, onCancel } = $$props;
  let formData = item ? { ...item } : {
    ...type === "likelihoodRating" || type === "riskControlRating" ? { name: "", symbol: "" } : type === "severity" ? { name: "", value: 0 } : { status: "" }
  };
  $$payload.out += `<form class="space-y-4"><h2 class="text-xl font-semibold mb-4">${escape_html(item ? "Edit" : "Add New")}
		${escape_html(type)}</h2> `;
  if (type === "likelihoodRating" || type === "riskControlRating") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="space-y-2"><label class="block text-sm font-medium">Name</label> <input type="text"${attr("value", formData.name)} class="w-full px-3 py-2 bg-background border border-border rounded-lg" required></div> <div class="space-y-2"><label class="block text-sm font-medium">Symbol</label> <input type="text"${attr("value", formData.symbol)} class="w-full px-3 py-2 bg-background border border-border rounded-lg" required></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    if (type === "severity") {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="space-y-2"><label class="block text-sm font-medium">Name</label> <input type="text"${attr("value", formData.name)} class="w-full px-3 py-2 bg-background border border-border rounded-lg" required></div> <div class="space-y-2"><label class="block text-sm font-medium">Value</label> <input type="number"${attr("value", formData.value)} class="w-full px-3 py-2 bg-background border border-border rounded-lg" required></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<div class="space-y-2"><label class="block text-sm font-medium">Status</label> <input type="text"${attr("value", formData.status)} class="w-full px-3 py-2 bg-background border border-border rounded-lg" required></div>`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--> <div class="flex justify-end gap-2 pt-4"><button type="button" class="px-4 py-2 border border-border rounded-lg hover:bg-muted">Cancel</button> <button type="submit" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">${escape_html(item ? "Update" : "Create")}</button></div></form>`;
  pop();
}
function TableRow($$payload, $$props) {
  push();
  let { item, type, onEdit, onDelete } = $$props;
  $$payload.out += `<tr class="hover:bg-muted/50">`;
  if (type === "likelihoodRating" || type === "riskControlRating") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<td class="px-6 py-4">${escape_html(item.name)}</td> <td class="px-6 py-4">${escape_html(item.symbol)}</td>`;
  } else {
    $$payload.out += "<!--[!-->";
    if (type === "severity") {
      $$payload.out += "<!--[-->";
      $$payload.out += `<td class="px-6 py-4">${escape_html(item.name)}</td> <td class="px-6 py-4">${escape_html(item.value)}</td>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<td class="px-6 py-4">${escape_html(item.status)}</td>`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--><td class="px-6 py-4"><div class="flex gap-2"><button class="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground">`;
  Pencil($$payload, { size: 16 });
  $$payload.out += `<!----></button> <button class="p-2 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg disabled:opacity-50">`;
  Trash_2($$payload, { size: 16 });
  $$payload.out += `<!----></button></div></td></tr>`;
  pop();
}
function Table($$payload, $$props) {
  push();
  let likelihoodRating = [];
  let severity = [];
  let riskControlRating = [];
  let riskMonitoringRating = [];
  let isLoading = false;
  let selectedDataType = "likelihoodRating";
  let showForm = false;
  let editingItem = null;
  const fetchLikelihoodRating = async () => {
    try {
      isLoading = true;
      const { data, error } = await supabase.from("likelihood_rating").select("*");
      if (error) throw error;
      likelihoodRating = data;
    } catch (error) {
      console.error("Error fetching likelihood rating:", error);
    } finally {
      isLoading = false;
    }
  };
  const fetchSeverity = async () => {
    try {
      isLoading = true;
      const { data, error } = await supabase.from("severity").select("*");
      if (error) throw error;
      severity = data;
    } catch (error) {
      console.error("Error fetching severity:", error);
    } finally {
      isLoading = false;
    }
  };
  const fetchRiskControlRating = async () => {
    try {
      isLoading = true;
      const { data, error } = await supabase.from("risk_control_rating").select("*");
      if (error) throw error;
      riskControlRating = data;
    } catch (error) {
      console.error("Error fetching risk control rating:", error);
    } finally {
      isLoading = false;
    }
  };
  const fetchRiskMonitoringRating = async () => {
    try {
      isLoading = true;
      const { data, error } = await supabase.from("risk_monitoring_rating").select("*");
      if (error) throw error;
      riskMonitoringRating = data;
    } catch (error) {
      console.error("Error fetching risk monitoring rating:", error);
    } finally {
      isLoading = false;
    }
  };
  const handleSave = async (formData) => {
    try {
      isLoading = true;
      const tableName = getTableName();
      if (editingItem) {
        const { error } = await supabase.from(tableName).update(formData).eq("id", editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(tableName).insert(formData);
        if (error) throw error;
      }
      await fetchData();
      closeForm();
    } catch (error) {
      console.error(error);
    } finally {
      isLoading = false;
    }
  };
  const deleteItem = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      isLoading = true;
      const tableName = getTableName();
      const { error } = await supabase.from(tableName).delete().eq("id", id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      isLoading = false;
    }
  };
  const getTableName = () => {
    switch (selectedDataType) {
      case "likelihoodRating":
        return "likelihood_rating";
      case "severity":
        return "severity";
      case "riskControlRating":
        return "risk_control_rating";
      case "riskMonitoringRating":
        return "risk_monitoring_rating";
      default:
        throw new Error("Invalid table name");
    }
  };
  const closeForm = () => {
    showForm = false;
    editingItem = null;
  };
  const editItem = (item) => {
    editingItem = item;
    showForm = true;
  };
  const fetchData = async () => {
    switch (selectedDataType) {
      case "likelihoodRating":
        await fetchLikelihoodRating();
        break;
      case "severity":
        await fetchSeverity();
        break;
      case "riskControlRating":
        await fetchRiskControlRating();
        break;
      case "riskMonitoringRating":
        await fetchRiskMonitoringRating();
        break;
    }
  };
  $$payload.out += `<div class="min-h-screen container"><div class="mb-6"><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><div class="flex items-center gap-2">`;
  Trending_up($$payload, { class: "w-8 h-8 text-primary" });
  $$payload.out += `<!----> <h1 class="text-2xl font-bold">Ratings Management</h1></div></div> <div class="flex justify-between py-3 items-center"><div class="flex items-center"><label for="dataSelect" class="text-lg font-semibold mr-4">Select Data Type:</label> <div class="relative w-64"><select id="dataSelect" class="w-full px-4 py-2 bg-card border border-border rounded-lg appearance-none"><option value="likelihoodRating">Likelihood Rating</option><option value="severity">Severity</option><option value="riskControlRating">Risk Control Rating</option><option value="riskMonitoringRating">Risk Monitoring Rating</option></select> <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"><svg class="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div></div></div> <button class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">`;
  Plus($$payload, { size: 20 });
  $$payload.out += `<!----> Add New</button></div></div> `;
  if (isLoading) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center p-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="overflow-x-auto bg-card rounded-lg shadow border border-border">`;
    {
      $$payload.out += "<!--[-->";
      const each_array = ensure_array_like(likelihoodRating);
      $$payload.out += `<table class="w-full"><thead class="bg-muted/50"><tr><th class="px-6 py-4 text-left">Name</th><th class="px-6 py-4 text-left">Symbol</th><th class="px-6 py-4 text-left">Actions</th></tr></thead><tbody class="divide-y divide-border"><!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let item = each_array[$$index];
        TableRow($$payload, {
          item,
          onEdit: editItem,
          onDelete: deleteItem,
          type: "likelihoodRating"
        });
      }
      $$payload.out += `<!--]--></tbody></table>`;
    }
    $$payload.out += `<!--]--> `;
    {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div>`;
  }
  $$payload.out += `<!--]--></div> `;
  if (showForm) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"><div class="bg-card p-6 rounded-lg w-full max-w-md relative border border-border"><button class="absolute right-4 top-4 p-1 hover:bg-muted rounded-lg">`;
    X($$payload, { size: 20 });
    $$payload.out += `<!----></button> `;
    RatingForm($$payload, {
      type: selectedDataType,
      item: editingItem,
      onSave: handleSave,
      onCancel: closeForm
    });
    $$payload.out += `<!----></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
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
