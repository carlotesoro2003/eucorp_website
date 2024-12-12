import { N as spread_props, O as slot, P as sanitize_props, L as escape_html, F as attr, C as pop, A as push, Q as ensure_array_like } from "../../../chunks/index.js";
/* empty css                       */
import { s as supabase } from "../../../chunks/supabaseClient.js";
import { P as Pencil } from "../../../chunks/pencil.js";
import { T as Trash_2 } from "../../../chunks/trash-2.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { S as Search } from "../../../chunks/search.js";
import { D as Download } from "../../../chunks/download.js";
import { P as Plus } from "../../../chunks/plus.js";
import { X } from "../../../chunks/x.js";
function Building($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "rect",
      {
        "width": "16",
        "height": "20",
        "x": "4",
        "y": "2",
        "rx": "2",
        "ry": "2"
      }
    ],
    ["path", { "d": "M9 22v-4h6v4" }],
    ["path", { "d": "M8 6h.01" }],
    ["path", { "d": "M16 6h.01" }],
    ["path", { "d": "M12 6h.01" }],
    ["path", { "d": "M12 10h.01" }],
    ["path", { "d": "M12 14h.01" }],
    ["path", { "d": "M16 10h.01" }],
    ["path", { "d": "M16 14h.01" }],
    ["path", { "d": "M8 10h.01" }],
    ["path", { "d": "M8 14h.01" }]
  ];
  Icon($$payload, spread_props([
    { name: "building" },
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
function DepartmentForm($$payload, $$props) {
  push();
  let { department = null, isSaving, onSave } = $$props;
  let name = department?.name ?? "";
  let fullName = department?.full_name ?? "";
  $$payload.out += `<form class="space-y-4"><h3 class="text-lg font-semibold">${escape_html(department ? "Edit" : "Add")} Department</h3> <div class="space-y-2"><label for="fullName" class="text-sm font-medium">Full Name</label> <input id="fullName" type="text"${attr("value", fullName)} required class="w-full px-3 py-2 rounded-lg bg-secondary border-secondary focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Enter full name..."></div> <div class="space-y-2"><label for="name" class="text-sm font-medium">Short Name</label> <input id="name" type="text"${attr("value", name)} required class="w-full px-3 py-2 rounded-lg bg-secondary border-secondary focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Enter short name..."></div> <button type="submit"${attr("disabled", isSaving, true)} class="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50">${escape_html(isSaving ? "Saving..." : department ? "Update" : "Add")} Department</button></form>`;
  pop();
}
function DepartmentCard($$payload, $$props) {
  push();
  let { department, isDeleting, onEdit, onDelete } = $$props;
  $$payload.out += `<div class="bg-card rounded-lg p-4 border border-border hover:shadow-lg transition-shadow"><div class="space-y-4"><h3 class="text-lg font-medium truncate">${escape_html(department.full_name)}</h3> <div class="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">${escape_html(department.name)}</div> <div class="flex justify-end gap-2 pt-4"><button class="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground" title="Edit department">`;
  Pencil($$payload, { size: 18 });
  $$payload.out += `<!----></button> <button${attr("disabled", isDeleting, true)} class="p-2 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg disabled:opacity-50" title="Delete department">`;
  Trash_2($$payload, { size: 18 });
  $$payload.out += `<!----></button></div></div></div>`;
  pop();
}
function Table($$payload, $$props) {
  push();
  let departments = [];
  let searchQuery = "";
  let currentPage = 1;
  let itemsPerPage = 6;
  let showForm = false;
  let editingDepartment = null;
  let alertMessage = "";
  let alertType = "success";
  let showAlert = false;
  let isSaving = false;
  let isDeleting = false;
  let isLoading = false;
  const filteredDepartments = departments.filter((dept) => dept.name.toLowerCase().includes(searchQuery.toLowerCase()) || dept.full_name.toLowerCase().includes(searchQuery.toLowerCase())).sort((a, b) => a.full_name.localeCompare(b.full_name));
  const paginatedDepartments = filteredDepartments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const showAlertMessage = (message, type = "success") => {
    alertMessage = message;
    alertType = type;
    showAlert = true;
    setTimeout(() => showAlert = false, 3e3);
  };
  const fetchDepartments = async () => {
    isLoading = true;
    const { data, error } = await supabase.from("departments").select("id, name, full_name");
    if (error) {
      showAlertMessage("Error fetching departments", "error");
    } else {
      departments = data;
    }
    isLoading = false;
  };
  const closeForm = () => {
    showForm = false;
    editingDepartment = null;
  };
  const handleSave = async (department) => {
    isSaving = true;
    if (department.id) {
      const { error } = await supabase.from("departments").update({
        name: department.name,
        full_name: department.full_name
      }).eq("id", department.id);
      if (error) {
        showAlertMessage("Error updating department", "error");
      } else {
        showAlertMessage("Department updated successfully");
        await fetchDepartments();
        closeForm();
      }
    } else {
      const { error } = await supabase.from("departments").insert({
        name: department.name,
        full_name: department.full_name
      });
      if (error) {
        showAlertMessage("Error adding department", "error");
      } else {
        showAlertMessage("Department added successfully");
        await fetchDepartments();
        closeForm();
      }
    }
    isSaving = false;
  };
  const handleDelete = async (id) => {
    isDeleting = true;
    const { error } = await supabase.from("departments").delete().eq("id", id);
    if (error) {
      showAlertMessage("Error deleting department", "error");
    } else {
      showAlertMessage("Department deleted successfully");
      await fetchDepartments();
    }
    isDeleting = false;
  };
  $$payload.out += `<div class="flex flex-col gap-4 container mx-auto"><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><div class="flex items-center gap-2">`;
  Building($$payload, { class: "w-8 h-8 text-primary" });
  $$payload.out += `<!----> <h1 class="text-2xl font-bold">Department Management</h1></div></div> `;
  if (showAlert) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div${attr("class", `p-4 rounded-lg ${alertType === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`)}>${escape_html(alertMessage)}</div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="flex flex-col md:flex-row gap-4 items-center justify-between"><div class="relative flex-1 w-full md:max-w-[300px]">`;
  Search($$payload, {
    class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground",
    size: 20
  });
  $$payload.out += `<!----> <input type="text"${attr("value", searchQuery)} placeholder="Search departments..." class="pl-10 pr-4 py-2 bg-secondary border-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring"></div> <div class="flex gap-2 w-full md:w-auto"><button class="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 justify-center flex-1 md:flex-initial">`;
  Download($$payload, { size: 20 });
  $$payload.out += `<!----> Export</button> <button class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 justify-center flex-1 md:flex-initial">`;
  Plus($$payload, { size: 20 });
  $$payload.out += `<!----> Add Department</button></div></div> `;
  if (isLoading) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center p-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    const each_array = ensure_array_like(paginatedDepartments);
    $$payload.out += `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let department = each_array[$$index];
      DepartmentCard($$payload, {
        department,
        isDeleting,
        onEdit: () => {
          editingDepartment = department;
          showForm = true;
        },
        onDelete: handleDelete
      });
    }
    $$payload.out += `<!--]--></div> <div class="flex flex-col sm:flex-row justify-between items-center gap-4"><div class="text-sm text-muted-foreground">Showing ${escape_html((currentPage - 1) * itemsPerPage + 1)} to ${escape_html(Math.min(currentPage * itemsPerPage, filteredDepartments.length))} of ${escape_html(filteredDepartments.length)} results</div> <div class="flex flex-col sm:flex-row items-center gap-4"><select class="bg-secondary border-secondary rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-auto"><option${attr("value", 6)}>6 per page</option><option${attr("value", 12)}>12 per page</option><option${attr("value", 24)}>24 per page</option><option${attr("value", 48)}>48 per page</option></select> <div class="flex gap-2"><button${attr("disabled", currentPage === 1, true)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Previous</button> <button${attr("disabled", currentPage === totalPages, true)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Next</button></div></div></div> `;
    if (showForm) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"><div class="bg-card p-6 rounded-lg w-full max-w-md relative border border-border"><button class="absolute right-4 top-4 p-1 hover:bg-muted rounded-lg">`;
      X($$payload, { size: 20 });
      $$payload.out += `<!----></button> `;
      DepartmentForm($$payload, {
        department: editingDepartment,
        isSaving,
        onSave: handleSave
      });
      $$payload.out += `<!----></div></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
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
