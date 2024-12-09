import { redirect } from '@sveltejs/kit';

export const GET = async (event) => {
	const { url, locals } = event;

	// Extract code and next parameters
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next') || '/dashboard';

	if (!code) {
		// Redirect to an error page or login with feedback
		console.error('OAuth code is missing.');
		throw redirect(303, '/auth/auth-code-error?message=missing-code');
	}

	// Exchange the code for a session
	const { error } = await locals.supabase.auth.exchangeCodeForSession(code);

	if (error) {
		console.error('Error exchanging code for session:', error.message);
		throw redirect(303, '/auth/auth-code-error');
	}

	// Redirect to the next page or dashboard
	throw redirect(303, next);
};
