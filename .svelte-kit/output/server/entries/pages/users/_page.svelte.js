import { F as attr, L as escape_html, C as pop, A as push, N as ensure_array_like, O as stringify } from "../../../chunks/index.js";
/* empty css                       */
import { s as supabase, a as supabaseAdmin } from "../../../chunks/supabaseClient.js";
import { P as Pencil } from "../../../chunks/pencil.js";
import { T as Trash_2 } from "../../../chunks/trash-2.js";
import { A as Arrow_up_down } from "../../../chunks/arrow-up-down.js";
import { S as Search } from "../../../chunks/search.js";
import { D as Download } from "../../../chunks/download.js";
import { X } from "../../../chunks/x.js";
function TableRow($$payload, $$props) {
  push();
  let {
    user,
    departments,
    onEdit,
    onDelete,
    onApprove,
    approvingUserId,
    deletingUserId
  } = $$props;
  $$payload.out += `<tr class="hover:bg-muted/50"><td class="px-4 py-2">`;
  if (user.profile_pic) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<img${attr("src", user.profile_pic)} alt="Profile" class="w-10 h-10 rounded-full object-cover">`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">${escape_html(user.first_name[0])}${escape_html(user.last_name[0])}</div>`;
  }
  $$payload.out += `<!--]--></td><td class="px-4 py-2">${escape_html(user.first_name)} ${escape_html(user.last_name)}</td><td class="px-4 py-2 hidden md:table-cell">${escape_html(user.email)}</td><td class="px-4 py-2 hidden sm:table-cell">${escape_html(user.role)}</td><td class="px-4 py-2">${escape_html(user.department_name || "N/A")}</td><td class="px-4 py-2">`;
  if (user.is_verified) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Verified</span>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Not Verified</span>`;
  }
  $$payload.out += `<!--]--></td><td class="px-4 py-2"><div class="flex items-center gap-2"><button class="p-1 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground" title="Edit user">`;
  Pencil($$payload, { size: 16 });
  $$payload.out += `<!----></button> `;
  if (!user.is_verified) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<button class="p-1 rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"${attr("disabled", approvingUserId === user.id, true)}>${escape_html(approvingUserId === user.id ? "Approving..." : "Approve")}</button>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <button class="p-1 hover:bg-red-100 rounded-lg text-red-500 hover:text-red-600 disabled:opacity-50" title="Delete user"${attr("disabled", deletingUserId === user.id, true)}>`;
  Trash_2($$payload, { size: 16 });
  $$payload.out += `<!----></button></div></td></tr>`;
  pop();
}
function UserForm($$payload, $$props) {
  push();
  let { user, departments, onSave, saving } = $$props;
  let formData = user ? {
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
    department_id: user.department_id
  } : {
    first_name: "",
    last_name: "",
    role: "",
    department_id: ""
  };
  const rolesWithoutDepartment = ["admin", "vice_president", "president"];
  $$payload.out += `<form class="space-y-4"><h3 class="text-lg font-semibold">${escape_html(user ? "Edit" : "Add")} User</h3> <div><label for="first_name" class="block text-sm font-medium mb-1">First Name</label> <input id="first_name" type="text" class="w-full p-2 rounded-md bg-secondary border-secondary focus:ring-2 focus:ring-ring"${attr("value", formData.first_name)} required></div> <div><label for="last_name" class="block text-sm font-medium mb-1">Last Name</label> <input id="last_name" type="text" class="w-full p-2 rounded-md bg-secondary border-secondary focus:ring-2 focus:ring-ring"${attr("value", formData.last_name)} required></div> <div><label for="role" class="block text-sm font-medium mb-1">Role</label> <select id="role" class="w-full p-2 rounded-md bg-secondary border-secondary focus:ring-2 focus:ring-ring" required><option value="">Select Role</option><option value="admin">Admin</option><option value="user">User</option><option value="vice_president">Vice President</option><option value="president">President</option></select></div> `;
  if (formData.role && !rolesWithoutDepartment.includes(formData.role)) {
    $$payload.out += "<!--[-->";
    const each_array = ensure_array_like(departments);
    $$payload.out += `<div><label for="department" class="block text-sm font-medium mb-1">Department</label> <select id="department" class="w-full p-2 rounded-md bg-secondary border-secondary focus:ring-2 focus:ring-ring" required><option value="">Select Department</option><!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let department = each_array[$$index];
      $$payload.out += `<option${attr("value", department.id)}>${escape_html(department.name)}</option>`;
    }
    $$payload.out += `<!--]--></select></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="flex justify-end gap-2 pt-4"><button type="submit" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"${attr("disabled", saving, true)}>${escape_html(saving ? "Saving..." : "Save")}</button></div></form>`;
  pop();
}
function Table($$payload, $$props) {
  push();
  let searchQuery = "";
  let currentPage = 1;
  let itemsPerPage = 5;
  let showForm = false;
  let editingUser = null;
  let statusFilter = "all";
  let roleFilter = "all";
  let showAlert = false;
  let alertMessage = "";
  let alertType = "success";
  let saving = false;
  let loading = true;
  let approvingUserId = null;
  let deletingUserId = null;
  let users = [];
  let departments = [];
  const init = async () => {
    await fetchDepartments();
    await fetchUsers();
    loading = false;
  };
  async function fetchDepartments() {
    const { data: deptData, error } = await supabase.from("departments").select("id, name");
    if (error) {
      displayAlert("Error fetching departments: " + error.message, "error");
    } else {
      departments = deptData || [];
    }
  }
  async function fetchUsers() {
    const { data: userData, error } = await supabase.from("profiles").select("id, first_name, last_name, email, role, department_id, profile_pic, is_verified");
    if (error) {
      displayAlert("Error fetching users: " + error.message, "error");
    } else {
      users = (userData || []).map((user) => ({
        ...user,
        department_name: departments.find((dept) => dept.id === user.department_id)?.name || "N/A"
      }));
    }
  }
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
  const uniqueRoles = [
    ...new Set(users.map((user) => user.role))
  ];
  const filteredItems = users.filter((user) => {
    const searchFields = `${user.first_name} ${user.last_name} ${user.email} ${user.role}`.toLowerCase();
    const matchesSearch = searchFields.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all";
    const matchesRole = roleFilter === "all";
    return matchesSearch && matchesStatus && matchesRole;
  }).sort((a, b) => {
    const aValue = a.first_name;
    const bValue = b.first_name;
    return aValue.localeCompare(bValue);
  });
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const saveProfile = async (formData) => {
    if (editingUser) {
      const rolesWithoutDepartment = ["admin", "vice_president", "president"];
      saving = true;
      const { error } = await supabase.from("profiles").update({
        first_name: formData.first_name,
        last_name: formData.last_name,
        department_id: rolesWithoutDepartment.includes(formData.role || "") ? void 0 : formData.department_id,
        role: formData.role
      }).eq("id", editingUser.id);
      if (error) {
        displayAlert("Error updating profile: " + error.message, "error");
      } else {
        await fetchUsers();
        displayAlert("Profile updated successfully!", "success");
        closeForm();
      }
      saving = false;
    }
  };
  const deleteUser = async (userId) => {
    deletingUserId = userId;
    try {
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (authError) {
        displayAlert("Error deleting user from authentication: " + authError.message, "error");
        return;
      }
      const { error: profileError } = await supabase.from("profiles").delete().eq("id", userId);
      if (profileError) {
        displayAlert("Error deleting user profile: " + profileError.message, "error");
      } else {
        await fetchUsers();
        displayAlert("User deleted successfully!", "success");
      }
    } catch (err) {
      displayAlert("An unexpected error occurred.", "error");
    } finally {
      deletingUserId = null;
    }
  };
  const approveUser = async (userId) => {
    approvingUserId = userId;
    try {
      const { error } = await supabase.from("profiles").update({ is_verified: true }).eq("id", userId);
      if (error) {
        displayAlert("Failed to approve user: " + error.message, "error");
      } else {
        await fetchUsers();
        displayAlert("User approved successfully!", "success");
      }
    } catch (err) {
      displayAlert("An unexpected error occurred.", "error");
    } finally {
      approvingUserId = null;
    }
  };
  const closeForm = () => {
    showForm = false;
    editingUser = null;
  };
  init();
  const each_array = ensure_array_like(uniqueRoles);
  $$payload.out += `<div class="flex flex-col gap-4 container mx-auto">`;
  if (showAlert) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div${attr("class", `alert alert-${stringify(alertType)} shadow-lg mb-4`)}><div><span>${escape_html(alertMessage)}</span></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><h2 class="text-2xl font-bold">Users Management</h2></div> <button class="md:hidden w-full px-4 py-2 bg-secondary rounded-lg text-left flex justify-between items-center">Filters `;
  Arrow_up_down($$payload, {
    size: 16,
    class: ""
  });
  $$payload.out += `<!----></button> <div${attr("class", `flex flex-col gap-4 ${"hidden"} md:flex md:flex-row md:items-center md:justify-between`)}><div class="flex flex-col md:flex-row gap-4 w-full md:w-auto"><div class="relative flex-1 md:w-[300px]">`;
  Search($$payload, {
    class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground",
    size: 20
  });
  $$payload.out += `<!----> <input type="text"${attr("value", searchQuery)} placeholder="Search users..." class="pl-10 pr-4 py-2 bg-secondary border-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring"></div> <select class="bg-secondary border-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-full md:w-[150px]"><option value="all">All Status</option><option value="active">Verified</option><option value="inactive">Not Verified</option></select> <select class="bg-secondary border-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-full md:w-[150px]"><option value="all">All Roles</option><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let role = each_array[$$index];
    $$payload.out += `<option${attr("value", role)}>${escape_html(role)}</option>`;
  }
  $$payload.out += `<!--]--></select></div> <div class="flex gap-2 w-full md:w-auto"><button class="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 justify-center flex-1 md:flex-initial whitespace-nowrap">`;
  Download($$payload, { size: 20 });
  $$payload.out += `<!----> Export</button></div></div> `;
  if (loading) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center p-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    const each_array_1 = ensure_array_like(paginatedItems);
    $$payload.out += `<div class="overflow-x-auto bg-card rounded-lg shadow border border-border"><table class="min-w-full table-auto"><thead class="bg-muted/50"><tr><th class="px-4 py-3 text-left">Profile</th><th class="px-4 py-3 text-left"><button class="flex items-center gap-1 hover:text-primary">Name `;
    Arrow_up_down($$payload, {
      size: 16,
      class: "text-primary"
    });
    $$payload.out += `<!----></button></th><th class="px-4 py-3 text-left hidden md:table-cell"><button class="flex items-center gap-1 hover:text-primary">Email `;
    Arrow_up_down($$payload, {
      size: 16,
      class: ""
    });
    $$payload.out += `<!----></button></th><th class="px-4 py-3 text-left hidden sm:table-cell"><button class="flex items-center gap-1 hover:text-primary">Role `;
    Arrow_up_down($$payload, {
      size: 16,
      class: ""
    });
    $$payload.out += `<!----></button></th><th class="px-4 py-3 text-left">Department</th><th class="px-4 py-3 text-left">Status</th><th class="px-4 py-3 text-left w-[100px]">Actions</th></tr></thead><tbody class="divide-y divide-border"><!--[-->`;
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let user = each_array_1[$$index_1];
      TableRow($$payload, {
        user,
        departments,
        onEdit: (user2) => {
          editingUser = user2;
          showForm = true;
        },
        onDelete: deleteUser,
        onApprove: approveUser,
        approvingUserId,
        deletingUserId
      });
    }
    $$payload.out += `<!--]--></tbody></table></div> <div class="flex flex-col sm:flex-row justify-between items-center gap-4"><div class="text-sm text-muted-foreground text-center sm:text-left">Showing ${escape_html((currentPage - 1) * itemsPerPage + 1)} to ${escape_html(Math.min(currentPage * itemsPerPage, filteredItems.length))} of ${escape_html(filteredItems.length)} results</div> <div class="flex flex-col sm:flex-row items-center gap-4"><select class="bg-secondary border-secondary rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-auto"><option${attr("value", 5)}>5 per page</option><option${attr("value", 10)}>10 per page</option><option${attr("value", 25)}>25 per page</option><option${attr("value", 50)}>50 per page</option></select> <div class="flex gap-2"><button${attr("disabled", currentPage === 1, true)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Previous</button> <button${attr("disabled", currentPage === totalPages, true)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Next</button></div></div></div>`;
  }
  $$payload.out += `<!--]--> `;
  if (showForm) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"><div class="bg-card p-6 rounded-lg w-full max-w-md relative border border-border"><button class="absolute right-4 top-4 p-1 hover:bg-muted rounded-lg">`;
    X($$payload, { size: 20 });
    $$payload.out += `<!----></button> `;
    UserForm($$payload, {
      user: editingUser,
      departments,
      onSave: saveProfile,
      saving
    });
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
