<script>import Auth from '../Auth.svelte';
export let supabaseClient;
export let socialLayout = 'vertical';
export let providers = [];
export let providerScopes = undefined;
export let queryParams = undefined;
export let redirectTo = undefined;
export let magicLink = false;
export let showLinks = false;
export let appearance = {};
export let theme = 'default';
export let localization = {};
</script>

<Auth
	view="sign_in"
	onlyThirdPartyProviders={false}
	{supabaseClient}
	{showLinks}
	{redirectTo}
	{socialLayout}
	{providers}
	{providerScopes}
	{queryParams}
	{magicLink}
	{appearance}
	{theme}
	{localization}
/>
