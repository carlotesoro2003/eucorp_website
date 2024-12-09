import { A as push, L as escape_html, F as attr, C as pop, N as ensure_array_like, O as stringify } from "../../../chunks/index.js";
/* empty css                       */
import { s as supabase } from "../../../chunks/supabaseClient.js";
import { X } from "../../../chunks/x.js";
import { P as Pencil } from "../../../chunks/pencil.js";
import { T as Trash_2 } from "../../../chunks/trash-2.js";
import { S as Search } from "../../../chunks/search.js";
import { P as Plus } from "../../../chunks/plus.js";
function UserForm($$payload, $$props) {
  push();
  let {
    isEditing = false,
    classification,
    onClose,
    onSubmit
  } = $$props;
  let currentClassification = { ...classification };
  $$payload.out += `<div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"><div class="bg-card p-6 rounded-lg w-full max-w-md relative border border-border"><button class="absolute right-4 top-4 p-1 hover:bg-muted rounded-lg">`;
  X($$payload, { size: 20 });
  $$payload.out += `<!----></button> <h2 class="text-xl font-bold mb-4">${escape_html(isEditing ? "Edit Classification" : "Add Classification")}</h2> <div class="flex flex-col gap-4"><div class="flex flex-col gap-2"><label for="name">Classification Name</label> <input id="name" type="text"${attr("value", currentClassification.name)} class="px-3 py-2 bg-secondary border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Enter classification name"></div> <div class="flex justify-end gap-2 mt-4"><button class="px-4 py-2 border border-border rounded-lg hover:bg-muted">Cancel</button> <button${attr("disabled", !currentClassification.name, true)} class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50">${escape_html("Save")}</button></div></div></div></div>`;
  pop();
}
function ClassificationCard($$payload, $$props) {
  push();
  let { classification, onEdit, onDelete } = $$props;
  let isDeleting = false;
  $$payload.out += `<div class="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-shadow"><div class="flex justify-between items-start gap-4"><h3 class="text-lg font-medium break-words flex-1">${escape_html(classification.name)}</h3> <div class="flex gap-2 shrink-0"><button class="hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground" title="Edit">`;
  Pencil($$payload, { size: 18 });
  $$payload.out += `<!----></button> <button class="hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg disabled:opacity-50" title="Delete"${attr("disabled", isDeleting, true)}>`;
  Trash_2($$payload, { size: 18 });
  $$payload.out += `<!----></button></div></div></div>`;
  pop();
}
function Table($$payload, $$props) {
  push();
  let classifications = [];
  let currentClassification = { id: null, name: "" };
  let showDialog = false;
  let isEditing = false;
  let searchQuery = "";
  let showAlert = false;
  let alertMessage = "";
  let alertType = "success";
  let isLoading = false;
  let currentPage = 1;
  let itemsPerPage = 6;
  const filteredClassifications = classifications.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const paginatedClassifications = filteredClassifications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredClassifications.length / itemsPerPage);
  const fetchClassifications = async () => {
    isLoading = true;
    const { data, error } = await supabase.from("classification").select("id, name");
    if (error) {
      showAlertMessage("Error fetching classifications.", "error");
    } else {
      classifications = data || [];
    }
    isLoading = false;
  };
  const showAlertMessage = (message, type = "success") => {
    alertMessage = message;
    alertType = type;
    showAlert = true;
    setTimeout(() => showAlert = false, 3e3);
  };
  const openDialog = (classification = { id: null, name: "" }) => {
    currentClassification = { ...classification };
    isEditing = classification.id !== null;
    showDialog = true;
  };
  const closeDialog = () => {
    showDialog = false;
    currentClassification = { id: null, name: "" };
  };
  const handleSubmit = async (classification) => {
    if (isEditing && classification.id !== null) {
      const { error } = await supabase.from("classification").update({ name: classification.name }).eq("id", classification.id);
      if (error) {
        showAlertMessage("Error updating classification.", "error");
        return false;
      }
      showAlertMessage("Classification updated successfully.");
    } else {
      const { error } = await supabase.from("classification").insert({ name: classification.name });
      if (error) {
        showAlertMessage("Error adding classification.", "error");
        return false;
      }
      showAlertMessage("Classification added successfully.");
    }
    await fetchClassifications();
    closeDialog();
    return true;
  };
  const deleteClassification = async (id) => {
    const { error } = await supabase.from("classification").delete().eq("id", id);
    if (error) {
      showAlertMessage("Error deleting classification.", "error");
    } else {
      showAlertMessage("Classification deleted successfully.");
      await fetchClassifications();
    }
  };
  $$payload.out += `<div class="flex flex-col gap-4 container mx-auto"><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><h2 class="text-2xl font-bold">Classifications Management</h2></div> `;
  if (showAlert) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div${attr("class", `p-4 rounded-lg ${stringify(alertType === "success" ? "bg-green-600" : "bg-red-600")} text-white`)}><span>${escape_html(alertMessage)}</span></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="flex flex-col md:flex-row gap-4 items-center justify-between"><div class="relative flex-1 w-full md:max-w-[300px]">`;
  Search($$payload, {
    class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground",
    size: 20
  });
  $$payload.out += `<!----> <input type="text"${attr("value", searchQuery)} placeholder="Search classifications..." class="pl-10 pr-4 py-2 bg-secondary border-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring"></div> <button class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 justify-center whitespace-nowrap w-full md:w-auto">`;
  Plus($$payload, { size: 20 });
  $$payload.out += `<!----> Add Classification</button></div> `;
  if (isLoading) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center p-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    const each_array = ensure_array_like(paginatedClassifications);
    $$payload.out += `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let classification = each_array[$$index];
      ClassificationCard($$payload, {
        classification,
        onEdit: openDialog,
        onDelete: deleteClassification
      });
    }
    $$payload.out += `<!--]--></div> <div class="flex flex-col sm:flex-row justify-between items-center gap-4"><div class="text-sm text-muted-foreground">Showing ${escape_html((currentPage - 1) * itemsPerPage + 1)} to ${escape_html(Math.min(currentPage * itemsPerPage, filteredClassifications.length))} of ${escape_html(filteredClassifications.length)} results</div> <div class="flex flex-col sm:flex-row items-center gap-4"><select class="bg-secondary border-secondary rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-auto"><option${attr("value", 6)}>6 per page</option><option${attr("value", 12)}>12 per page</option><option${attr("value", 24)}>24 per page</option><option${attr("value", 48)}>48 per page</option></select> <div class="flex gap-2"><button${attr("disabled", currentPage === 1, true)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Previous</button> <button${attr("disabled", currentPage === totalPages, true)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Next</button></div></div></div>`;
  }
  $$payload.out += `<!--]--> `;
  if (showDialog) {
    $$payload.out += "<!--[-->";
    UserForm($$payload, {
      isEditing,
      classification: currentClassification,
      onClose: closeDialog,
      onSubmit: handleSubmit
    });
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
