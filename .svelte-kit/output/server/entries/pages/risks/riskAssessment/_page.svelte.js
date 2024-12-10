import { L as escape_html, C as pop, A as push } from "../../../../chunks/index.js";
import "../../../../chunks/supabaseClient.js";
function Notifications($$payload, $$props) {
  let { successMessage, errorMessage } = $$props;
  if (successMessage) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded"><p>${escape_html(successMessage)}</p></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (errorMessage) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded"><p>${escape_html(errorMessage)}</p></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
}
function Header($$payload, $$props) {
  let { departmentName } = $$props;
  $$payload.out += `<header class="bg-white dark:bg-gray-800 shadow-sm"><div class="container mx-auto px-4 py-6"><h1 class="text-3xl font-bold text-gray-900 dark:text-white">${escape_html(departmentName)} Risk Register</h1> <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">Manage and assess department risks</p></div></header>`;
}
function _page($$payload, $$props) {
  push();
  let departmentName = "";
  let successMessage = null;
  let errorMessage = null;
  $$payload.out += `<div class="min-h-screen bg-gray-50 dark:bg-gray-900">`;
  Header($$payload, { departmentName });
  $$payload.out += `<!----> <main class="container mx-auto px-4 py-8">`;
  Notifications($$payload, { successMessage, errorMessage });
  $$payload.out += `<!----> `;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center items-center min-h-[400px]"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>`;
  }
  $$payload.out += `<!--]--></main></div>`;
  pop();
}
export {
  _page as default
};
