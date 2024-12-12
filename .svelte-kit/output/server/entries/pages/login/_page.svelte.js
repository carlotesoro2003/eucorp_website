import { N as spread_props, O as slot, P as sanitize_props, L as escape_html, F as attr, C as pop, A as push } from "../../../chunks/index.js";
import "../../../chunks/supabaseClient.js";
/* empty css                                                  */
import { I as Icon } from "../../../chunks/Icon.js";
import { E as Eye } from "../../../chunks/eye.js";
function Moon($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      { "d": "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "moon" },
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
function Sun($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "circle",
      { "cx": "12", "cy": "12", "r": "4" }
    ],
    ["path", { "d": "M12 2v2" }],
    ["path", { "d": "M12 20v2" }],
    ["path", { "d": "m4.93 4.93 1.41 1.41" }],
    ["path", { "d": "m17.66 17.66 1.41 1.41" }],
    ["path", { "d": "M2 12h2" }],
    ["path", { "d": "M20 12h2" }],
    ["path", { "d": "m6.34 17.66-1.41 1.41" }],
    ["path", { "d": "m19.07 4.93-1.41 1.41" }]
  ];
  Icon($$payload, spread_props([
    { name: "sun" },
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
  let isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  let email = "";
  let password = "";
  let isLoading = false;
  $$payload.out += `<div class="min-h-screen grid lg:grid-cols-2 transition-colors duration-300 dark:bg-gray-900"><button class="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 z-50" aria-label="Toggle theme">`;
  if (isDark) {
    $$payload.out += "<!--[-->";
    Sun($$payload, { class: "w-5 h-5 text-yellow-500" });
  } else {
    $$payload.out += "<!--[!-->";
    Moon($$payload, { class: "w-5 h-5 text-gray-700" });
  }
  $$payload.out += `<!--]--></button> <div class="relative hidden lg:block bg-cover bg-center" style="background-image: linear-gradient(180deg, rgba(103, 21, 21, 0.8) 0%, rgba(103, 21, 21, 0.3) 50%), url('/images/login_bg.png');"><div class="relative z-10 h-full flex flex-col items-center justify-center space-y-4 p-10"><div class="text-center"><h1 class="text-5xl font-extrabold text-white tracking-tight mb-4">EuCorp</h1> <p class="text-xl text-gray-300 max-w-md">Our Institutional Planning System</p></div> <div class="mt-6 space-y-2 text-gray-200"><div class="flex items-center space-x-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> <p>Streamline Project Management</p></div> <div class="flex items-center space-x-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> <p>Enhance Collaboration</p></div> <div class="flex items-center space-x-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> <p>Monitor Progress Effectively</p></div></div></div></div> <div class="flex items-center justify-center px-8"><div class="w-full max-w-md"><div class="text-center mb-8"><h1 class="text-2xl font-semibold dark:text-white">${escape_html("Login")}</h1> <p class="text-gray-600 dark:text-gray-400">${escape_html("Sign in to continue")}</p></div> <form class="space-y-4">`;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <input type="email"${attr("value", email)} placeholder="name@example.com" required class="input input-bordered w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"> <div class="relative"><input${attr("type", "password")}${attr("value", password)} placeholder="Password" required class="input input-bordered w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"> <button type="button" class="absolute inset-y-0 right-4 flex items-center dark:text-gray-400">`;
  {
    $$payload.out += "<!--[!-->";
    Eye($$payload, { class: "w-5 h-5" });
  }
  $$payload.out += `<!--]--></button></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <button type="submit" class="btn bg-rose-700 w-full text-white hover:bg-rose-800 dark:bg-rose-800 dark:hover:bg-rose-900"${attr("disabled", isLoading, true)}>`;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <span>${escape_html("Login")}</span></button></form> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="divider dark:text-gray-400">OR</div> <button type="button" class="btn bg-blue-600 w-full text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 flex items-center justify-center space-x-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-5 h-5" fill="none"><path d="M126.23 14.7L0 207.43h71.54L126.23 80.7l54.7 126.74h71.54L126.23 14.7Z" fill="#0078D4"></path><path d="M88.73 213.22H176l-44.76-79.55-42.51 79.55Z" fill="#008AD7"></path><path d="M176 213.22H252L200.28 127l-24.28 86.22Z" fill="#0079B7"></path></svg> <span>Sign in with Azure</span></button> <p class="text-sm text-center mt-4 dark:text-gray-400">`;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `Don't have an account? <button class="text-primary dark:text-blue-400 font-medium">Register</button>`;
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
