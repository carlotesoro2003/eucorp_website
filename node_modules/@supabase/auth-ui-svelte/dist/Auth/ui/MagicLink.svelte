<script>import Auth from '../Auth.svelte';
export let supabaseClient;
export let socialLayout = 'vertical';
export let providers = [];
export let providerScopes = undefined;
export let queryParams = undefined;
export let redirectTo = undefined;
export let appearance = {};
export let theme = 'default';
export let localization = {};
</script>

<Auth
	{supabaseClient}
	showLinks={false}
	magicLink={false}
	{redirectTo}
	view="magic_link"
	{socialLayout}
	{providers}
	{providerScopes}
	{queryParams}
	{appearance}
	{theme}
	{localization}
/>
