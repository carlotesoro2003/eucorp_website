import { P as spread_props, Q as slot, R as sanitize_props, L as escape_html, F as attr, C as pop, A as push } from "../../../chunks/index.js";
import "../../../chunks/supabaseClient.js";
import { I as Icon } from "../../../chunks/Icon.js";
function Eye($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
      }
    ],
    [
      "circle",
      { "cx": "12", "cy": "12", "r": "3" }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "eye" },
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
function Login($$payload, $$props) {
  push();
  let email = "";
  let password = "";
  let isLoading = false;
  $$payload.out += `<div class="h-screen grid lg:grid-cols-2"><div class="relative hidden lg:block" style="background-image: linear-gradient(180deg, rgba(103, 21, 21, 0.8) 0%, rgba(103, 21, 21, 0.3) 50%), url('/images/login_bg.png'); background-repeat: no-repeat; background-size: cover; background-position: center;"><div class="relative z-10 h-full flex flex-col items-center justify-center space-y-4 p-10"><div class="text-center"><h1 class="text-5xl font-extrabold text-white tracking-tight mb-4">EuCorp</h1> <p class="text-xl text-gray-300 max-w-md">Our Institutional Planning System</p></div> <div class="mt-6 space-y-2 text-gray-200"><div class="flex items-center space-x-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> <p>Streamline Project Management</p></div> <div class="flex items-center space-x-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> <p>Enhance Collaboration</p></div> <div class="flex items-center space-x-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> <p>Monitor Progress Effectively</p></div></div></div></div> <div class="flex items-center justify-center px-8"><div class="w-full max-w-md"><div class="text-center mb-8"><h1 class="text-2xl font-semibold">${escape_html("Login")}</h1> <p class="text-gray-600">${escape_html("Sign in to continue")}</p></div> <form class="space-y-4">`;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <input type="email"${attr("value", email)} placeholder="name@example.com" required class="input input-bordered w-full"> <div class="relative"><input${attr("type", "password")}${attr("value", password)} placeholder="Password" required class="input input-bordered w-full"> <button type="button" class="absolute inset-y-0 right-4 flex items-center">`;
  {
    $$payload.out += "<!--[!-->";
    Eye($$payload, { class: "w-5 h-5" });
  }
  $$payload.out += `<!--]--></button></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <button type="submit" class="btn bg-rose-700 w-full text-white"${attr("disabled", isLoading, true)}>`;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <span>${escape_html("Login")}</span></button></form> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="divider">OR</div> <button type="button" class="btn bg-blue-600 w-full text-white flex items-center justify-center space-x-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-5 h-5" fill="none"><path d="M126.23 14.7L0 207.43h71.54L126.23 80.7l54.7 126.74h71.54L126.23 14.7Z" fill="#0078D4"></path><path d="M88.73 213.22H176l-44.76-79.55-42.51 79.55Z" fill="#008AD7"></path><path d="M176 213.22H252L200.28 127l-24.28 86.22Z" fill="#0079B7"></path></svg> <span>Sign in with Azure</span></button> <p class="text-sm text-center mt-4">`;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `Don't have an account? <button class="text-primary font-medium">Register</button>`;
  }
  $$payload.out += `<!--]--></p></div></div></div>`;
  pop();
}
function _page($$payload) {
  Login($$payload);
}
export {
  _page as default
};
