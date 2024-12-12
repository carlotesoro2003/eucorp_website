import { E as fallback, Q as ensure_array_like, F as attr, R as stringify, L as escape_html, G as bind_props, C as pop, A as push } from "../../../../chunks/index.js";
import { s as supabase } from "../../../../chunks/supabaseClient.js";
import { M as Monitor, A as AdminPlansMonitoring, D as DeptPlansMonitoring, C as Circle_alert, a as Clipboard_list, T as Triangle_alert } from "../../../../chunks/DeptPlansMonitoring.js";
import "jspdf";
import "jspdf-autotable";
import { L as Lightbulb } from "../../../../chunks/lightbulb.js";
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
  $$payload.out += `<div class="min-h-screen"><div class="container mx-auto px-4 py-8"><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3"><div class="flex items-center gap-2">`;
  Monitor($$payload, { class: "w-8 h-8 text-primary" });
  $$payload.out += `<!----> <h1 class="text-2xl font-bold">Mid-year Monitoring Dashboard</h1></div></div> <div class="rounded-lg shadow-sm mb-6"><div class="flex flex-wrap gap-2 p-2"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let tab = each_array[$$index];
    $$payload.out += `<button${attr("class", `flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${stringify(activeTab === tab.id ? "bg-primary hover:bg-primary/90 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300")}`)}><!---->`;
    tab.icon?.($$payload, { size: 18 });
    $$payload.out += `<!----> <span>${escape_html(tab.label)}</span></button>`;
  }
  $$payload.out += `<!--]--></div></div> <div class="rounded-lg shadow-sm p-6">`;
  if (loading) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center p-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>`;
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
