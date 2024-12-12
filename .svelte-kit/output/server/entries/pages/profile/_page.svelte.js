import { N as spread_props, O as slot, P as sanitize_props, C as pop, F as attr, A as push } from "../../../chunks/index.js";
import { s as supabase } from "../../../chunks/supabaseClient.js";
import { L as Loader_circle } from "../../../chunks/loader-circle.js";
import { U as User } from "../../../chunks/user.js";
import { I as Icon } from "../../../chunks/Icon.js";
function Camera($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"
      }
    ],
    [
      "circle",
      { "cx": "12", "cy": "13", "r": "3" }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "camera" },
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
function Mail($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "rect",
      {
        "width": "20",
        "height": "16",
        "x": "2",
        "y": "4",
        "rx": "2"
      }
    ],
    [
      "path",
      {
        "d": "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "mail" },
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
function _page($$payload, $$props) {
  push();
  let { $$slots, $$events, ...props } = $$props;
  let { session } = props.data;
  let profile = null;
  let loading = true;
  let saving = false;
  let uploadedImageUrl = null;
  const fetchUserProfile = async () => {
    if (session) {
      const { user } = session;
      const { data, error } = await supabase.from("profiles").select("first_name, last_name, email, role, profile_pic").eq("id", user.id).single();
      if (error) {
        console.error("Error fetching user profile:", error.message);
      } else {
        profile = data;
        uploadedImageUrl = profile.profile_pic || null;
      }
    }
    loading = false;
  };
  fetchUserProfile();
  $$payload.out += `<div class="min-h-screen bg-gray-50 text-gray-900 w-full py-8 px-4"><div class="max-w-2xl mx-auto">`;
  if (loading) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex flex-col items-center justify-center h-[60vh] gap-3">`;
    Loader_circle($$payload, { class: "w-8 h-8 animate-spin text-primary" });
    $$payload.out += `<!----> <p class="text-lg text-gray-600">Loading your profile...</p></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    if (session !== null && profile) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="bg-white rounded-xl shadow-sm p-6 md:p-8"><h1 class="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1> <form class="space-y-6"><div class="flex flex-col items-center gap-4"><div class="relative group cursor-pointer"><div${attr("class", `w-32 h-32 rounded-full overflow-hidden border-4 transition-all duration-300 ${"border-gray-100"}`)}>`;
      if (uploadedImageUrl) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<img${attr("src", uploadedImageUrl)} alt="Profile" class="w-full h-full object-cover">`;
      } else {
        $$payload.out += "<!--[!-->";
        $$payload.out += `<div class="w-full h-full bg-gray-100 flex items-center justify-center">`;
        User($$payload, { class: "w-12 h-12 text-gray-400" });
        $$payload.out += `<!----></div>`;
      }
      $$payload.out += `<!--]--></div> <div class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">`;
      Camera($$payload, { class: "w-8 h-8 text-white" });
      $$payload.out += `<!----></div> <input type="file" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"></div> <p class="text-sm text-gray-500">Drag and drop or click to change profile picture</p></div> <div class="grid md:grid-cols-2 gap-6"><div class="space-y-2"><label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label> <input id="firstName" type="text"${attr("value", profile.first_name)} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" placeholder="Enter your first name"></div> <div class="space-y-2"><label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label> <input id="lastName" type="text"${attr("value", profile.last_name)} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" placeholder="Enter your last name"></div> <div class="space-y-2"><label for="email" class="block text-sm font-medium text-gray-700">Email</label> <div class="relative">`;
      Mail($$payload, {
        class: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
      });
      $$payload.out += `<!----> <input id="email" type="email"${attr("value", profile.email ?? "")} disabled class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500"></div></div> <div class="space-y-2"><label for="role" class="block text-sm font-medium text-gray-700">Role</label> <input id="role" type="text"${attr("value", profile.role ?? "User")} disabled class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500"></div></div> <div class="flex justify-end pt-4"><button type="submit"${attr("disabled", saving, true)} class="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">`;
      {
        $$payload.out += "<!--[!-->";
        $$payload.out += `Save Changes`;
      }
      $$payload.out += `<!--]--></button></div></form></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></div></div>`;
  pop();
}
export {
  _page as default
};
