import { E as fallback, N as ensure_array_like, F as attr, O as stringify, L as escape_html, G as bind_props, C as pop, A as push } from "../../../../chunks/index.js";
import { s as supabase } from "../../../../chunks/supabaseClient.js";
import { A as AdminPlansMonitoring, D as DeptPlansMonitoring, C as Circle_alert, a as Clipboard_list, T as Triangle_alert, L as Lightbulb } from "../../../../chunks/DeptPlansMonitoring.js";
import "jspdf";
import "jspdf-autotable";
/* empty css                          */
function _page($$payload, $$props) {
  push();
  let data = fallback($$props["data"], null);
  let session = null;
  let profile = null;
  let loading = true;
  let activeTab = "Plans";
  const tabs = [
    {
      id: "Plans",
      label: "Plans",
      icon: Clipboard_list
    },
    {
      id: "Risks",
      label: "Risks",
      icon: Triangle_alert
    },
    {
      id: "Opportunities",
      label: "Opportunities",
      icon: Lightbulb
    }
  ];
  const fetchUserProfile = async () => {
    try {
      if (data?.session) {
        session = data.session;
        const { user } = session;
        const { data: profileData, error } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        if (error) {
          console.error("Error fetching user profile:", error.message);
        } else {
          profile = profileData;
          console.log("Role in Opportunities: ", profile);
        }
      } else {
        console.warn("Session is not available or data is missing.");
      }
    } catch (error) {
      console.error("Error fetching user profile or session:", error);
    } finally {
      loading = false;
    }
  };
  fetchUserProfile();
  const each_array = ensure_array_like(tabs);
  $$payload.out += `<div class="min-h-screen bg-gray-50 dark:bg-gray-900"><div class="container mx-auto px-4 py-8"><div class="mb-8"><h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Year-end Monitoring Dashboard</h1> <p class="text-gray-600 dark:text-gray-400">Track and manage your organization's plans, risks, and opportunities</p></div> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6"><div class="flex flex-wrap gap-2 p-2"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let tab = each_array[$$index];
    $$payload.out += `<button${attr("class", `flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${stringify(activeTab === tab.id ? "bg-blue-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300")}`)}><!---->`;
    tab.icon?.($$payload, { size: 18 });
    $$payload.out += `<!----> <span>${escape_html(tab.label)}</span></button>`;
  }
  $$payload.out += `<!--]--></div></div> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">`;
  if (loading) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex flex-col items-center justify-center py-12"><div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div> <p class="mt-4 text-gray-600 dark:text-gray-400">Loading your dashboard...</p></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    if (session && profile) {
      $$payload.out += "<!--[-->";
      if (profile.role === "admin" || profile.role === "vice_president" || profile.role === "president") {
        $$payload.out += "<!--[-->";
        {
          $$payload.out += "<!--[-->";
          AdminPlansMonitoring($$payload);
        }
        $$payload.out += `<!--]-->`;
      } else {
        $$payload.out += "<!--[!-->";
        if (profile.role === "user") {
          $$payload.out += "<!--[-->";
          {
            $$payload.out += "<!--[-->";
            DeptPlansMonitoring($$payload);
          }
          $$payload.out += `<!--]-->`;
        } else {
          $$payload.out += "<!--[!-->";
          $$payload.out += `<div class="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">`;
          Circle_alert($$payload, { size: 24 });
          $$payload.out += `<!----> <p>You do not have the required permissions to view this page.</p></div>`;
        }
        $$payload.out += `<!--]-->`;
      }
      $$payload.out += `<!--]-->`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<div class="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">`;
      Circle_alert($$payload, { size: 24 });
      $$payload.out += `<!----> <p>Failed to load session or profile data. Please try refreshing the page.</p></div>`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></div></div></div>`;
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
