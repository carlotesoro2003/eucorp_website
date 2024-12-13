import { redirect } from '@sveltejs/kit';

export const GET = async (event) => {
	const { url, locals } = event;

	// Extract `code` and `next` parameters
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next') || '/dashboard';

	if (!code) {
		// Redirect to an error page with a helpful message
		console.error('OAuth code is missing.');
		throw redirect(303, '/auth/auth-code-error?message=missing-code');
	}

	try {
		// Exchange the code for an access token/session
		const { data, error } = await locals.supabase.auth.exchangeCodeForSession(code);

		if (error) {
			console.error('Error exchanging code for session:', error.message);
			throw redirect(303, '/auth/auth-code-error');
		}

		// Ensure the session is set
		if (!data.session) {
			console.error('No session returned during exchange.');
			throw redirect(303, '/auth/auth-code-error?message=missing-session');
		}

		// Redirect to the next or default page
		throw redirect(303, next);
	} catch (err) {
		console.error('Unexpected error during OAuth callback:', err);
		throw redirect(303, '/auth/auth-code-error');
	}
};
