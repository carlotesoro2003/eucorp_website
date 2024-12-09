import { r as redirect } from "../../../../chunks/index2.js";
const GET = async (event) => {
  const { url, locals } = event;
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/dashboard";
  if (!code) {
    console.error("OAuth code is missing.");
    throw redirect(303, "/auth/auth-code-error?message=missing-code");
  }
  const { error } = await locals.supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("Error exchanging code for session:", error.message);
    throw redirect(303, "/auth/auth-code-error");
  }
  throw redirect(303, next);
};
export {
  GET
};
