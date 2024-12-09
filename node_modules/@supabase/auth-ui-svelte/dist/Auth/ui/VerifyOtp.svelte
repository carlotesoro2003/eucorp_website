<script>import Auth from '../Auth.svelte';
export let supabaseClient;
export let otpType = 'email';
export let appearance = {};
export let theme = 'default';
export let localization = {};
</script>

<Auth
	{supabaseClient}
	showLinks={false}
	magicLink={false}
	view="verify_otp"
	{otpType}
	{appearance}
	{theme}
	{localization}
/>
