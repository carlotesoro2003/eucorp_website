<script>import Anchor from '../../UI/Anchor.svelte';
import Button from '../../UI/Button.svelte';
import Container from '../../UI/Container.svelte';
import Input from '../../UI/Input.svelte';
import Label from '../../UI/Label.svelte';
import Message from '../../UI/Message.svelte';
import { VIEWS } from '@supabase/auth-ui-shared';
export let i18n;
export let supabaseClient;
export let authView;
export let redirectTo = undefined;
export let email = '';
export let showLinks = false;
export let appearance;
let message = '';
let error = '';
let loading = false;
async function handleSubmit() {
    loading = true;
    error = '';
    message = '';
    const { error: resetPasswordError } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo
    });
    if (resetPasswordError)
        error = resetPasswordError.message;
    else
        message = i18n.forgotten_password?.confirmation_text;
    loading = false;
}
</script>

<form id="auth-forgot-password" method="post" on:submit|preventDefault={handleSubmit}>
	<Container direction="vertical" gap="large" {appearance}>
		<Container direction="vertical" gap="large" {appearance}>
			<div>
				<Label for="email" {appearance}>{i18n?.forgotten_password?.email_label}</Label>
				<Input
					id="email"
					type="email"
					name="email"
					autofocus
					placeholder={i18n?.forgotten_password?.email_input_placeholder}
					bind:value={email}
					autocomplete="email"
					{appearance}
				/>
			</div>
			<Button type="submit" color="primary" {loading} {appearance}>
				{loading ? i18n?.forgotten_password?.loading_button_label : i18n?.forgotten_password?.button_label}
			</Button>
		</Container>

		{#if showLinks}
			<Anchor
				on:click={(e) => {
					e.preventDefault();
					authView = VIEWS.SIGN_IN;
				}}
				href="#auth-magic-link"
				{appearance}>{i18n?.sign_in?.link_text}</Anchor
			>
		{/if}
		{#if message}
			<Message {appearance}>
				{message}
			</Message>
		{/if}
		{#if error}
			<Message color="danger" {appearance}>
				{error}
			</Message>
		{/if}
	</Container>
</form>

<style>
	form {
		width: 100%;
	}
</style>
