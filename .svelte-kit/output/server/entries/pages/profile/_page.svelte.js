import { G as bind_props, C as pop, F as attr, A as push } from "../../../chunks/index.js";
/* empty css                       */
import { s as supabase } from "../../../chunks/supabaseClient.js";
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  const { session } = data;
  let profile = null;
  let loading = true;
  let saving = false;
  let uploadedImageUrl = null;
  const fetchUserProfile = async () => {
    if (session) {
      const { user } = session;
      const { data: data2, error } = await supabase.from("profiles").select("first_name, last_name, email, role, profile_pic").eq("id", user.id).single();
      if (error) {
        console.error("Error fetching user profile:", error.message);
      } else {
        profile = data2;
        uploadedImageUrl = profile.profile_pic || null;
      }
    }
    loading = false;
  };
  fetchUserProfile();
  $$payload.out += `<div class="hero min-h-screen overflow-y-auto"><div class="hero-content flex flex-col items-center justify-center"><div class="max-w-md text-center">`;
  if (loading) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<span class="loading loading-spinner loading-sm"></span> <p>Loading...</p>`;
  } else {
    $$payload.out += "<!--[!-->";
    if (session !== null && profile) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<h1 class="font-bold text-4xl">Edit Profile</h1> `;
      if (uploadedImageUrl) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<img${attr("src", uploadedImageUrl)} alt="Profile Picture" class="rounded-full w-32 h-32 mx-auto mb-4">`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> <form class="mt-4"><div class="mb-4"><label for="profile-pic" class="mb-2 cursor-pointer">Profile Picture</label> <div class="relative"><input id="profile-pic" type="file" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"> <button type="button" class="w-full py-2 px-4 border border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-200 focus:outline-none text-gray-700">`;
      if (uploadedImageUrl) {
        $$payload.out += "<!--[-->";
        $$payload.out += `Change Image`;
      } else {
        $$payload.out += "<!--[!-->";
        $$payload.out += `Upload Image`;
      }
      $$payload.out += `<!--]--></button></div></div> <div class="mb-4"><label for="first-name">First Name</label> <input id="first-name" type="text"${attr("value", profile.first_name)} placeholder="Enter first name" class="input input-bordered w-full"></div> <div class="mb-4"><label for="last-name">Last Name</label> <input id="last-name" type="text"${attr("value", profile.last_name)} placeholder="Enter last name" class="input input-bordered w-full"></div> <div class="mb-4"><label for="role">Role</label> <input id="role" type="text"${attr("value", profile.role)} disabled class="input input-bordered w-full bg-gray-100"></div> <button type="submit" class="btn btn-primary w-full"${attr("disabled", saving, true)}>`;
      {
        $$payload.out += "<!--[!-->";
        $$payload.out += `Save Profile`;
      }
      $$payload.out += `<!--]--></button></form>`;
    } else {
      $$payload.out += "<!--[!-->";
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
