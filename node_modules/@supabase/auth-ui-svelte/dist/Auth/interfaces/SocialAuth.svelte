<script>import { template } from '@supabase/auth-ui-shared';
import Button from '../../UI/Button.svelte';
import Container from '../../UI/Container.svelte';
import Icons from '../Icons.svelte';
import Divider from '../../UI/Divider.svelte';
export let supabaseClient;
export let socialLayout;
export let redirectTo = undefined;
export let onlyThirdPartyProviders;
export let i18n;
export let providers = [];
export let providerScopes;
export let queryParams;
export let appearance;
let error = '';
let loading = false;
$: verticalSocialLayout = socialLayout === 'vertical' ? true : false;
async function handleProviderSignIn(provider) {
    loading = true;
    error = '';
    const { error: providerSigninError } = await supabaseClient.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo,
            scopes: providerScopes?.[provider],
            queryParams
        }
    });
    if (providerSigninError)
        error = providerSigninError.message;
    loading = false;
}
function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1).toLowerCase();
}
let iconTitle = (provider) => template(i18n['sign_in']?.social_provider_text, {
    provider: capitalize(provider)
});
</script>

{#if providers.length}
	<Container direction="vertical" gap="large" {appearance}>
		<Container
			direction={verticalSocialLayout ? 'vertical' : 'horizontal'}
			gap={verticalSocialLayout ? 'small' : 'medium'}
			{appearance}
		>
			{#each providers as provider}
				<Button
					aria-label={iconTitle(provider)}
					on:click={() => handleProviderSignIn(provider)}
					type="submit"
					color="default"
					{loading}
					{appearance}
				>
					<Icons {provider} />
					{#if verticalSocialLayout}
						{iconTitle(provider)}
					{/if}
				</Button>
			{/each}
		</Container>
	</Container>
	{#if !onlyThirdPartyProviders}
		<Divider {appearance} />
	{/if}
{/if}
