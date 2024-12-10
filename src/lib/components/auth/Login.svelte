<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import Eye from "lucide-svelte/icons/eye";
	import EyeOff from "lucide-svelte/icons/eye-off";
	import Moon from "lucide-svelte/icons/moon";
	import Sun from "lucide-svelte/icons/sun";

	// Theme state
	let isDark: boolean = $state(window.matchMedia("(prefers-color-scheme: dark)").matches);

	// Form states
	let email: string = $state("");
	let password: string = $state("");
	let confirmPassword: string = $state("");
	let firstName: string = $state("");
	let lastName: string = $state("");
	let message: string = $state("");
	let isLoading: boolean = $state(false);
	let isLogin: boolean = $state(true);
	let showPassword: boolean = $state(false);

	/** Toggle theme */
	function toggleTheme() {
		isDark = !isDark;
		document.documentElement.classList.toggle("dark");
	}

	/** Handle authentication */
	async function handleAuth() {
		isLoading = true;
		message = "";

		if (!isLogin) {
			// Registration flow
			if (password !== confirmPassword) {
				message = "Passwords do not match.";
				isLoading = false;
				return;
			}

			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: { first_name: firstName, last_name: lastName },
				},
			});

			if (error) {
				message = `Failed to register: ${error.message}`;
				console.error("Registration error:", error);
				isLoading = false;
				return;
			}

			// Add user to profiles table
			const user = data?.user;
			if (user) {
				const { error: profileError } = await supabase.from("profiles").insert({
					id: user.id,
					email: user.email,
					first_name: firstName,
					last_name: lastName,
					role: "user",
					is_verified: false,
				});

				if (profileError) {
					console.error("Error inserting profile:", profileError);
					message = "Profile creation failed. Please try again later.";
					isLoading = false;
					return;
				}
			}

			message = "Registration successful! Please check your email for verification.";
		} else {
			// Login flow
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				message = `Failed to login: ${error.message}`;
				console.error("Login error:", error);
				isLoading = false;
				return;
			}

			// Check profiles table for verification
			const user = data?.user;
			if (user) {
				const { data: profile, error: profileError } = await supabase.from("profiles").select("is_verified").eq("id", user.id).single();

				if (profileError) {
					console.error("Error fetching profile:", profileError);
					message = "Error checking verification status.";
					isLoading = false;
					return;
				}

				if (!profile?.is_verified) {
					message = "Your account is pending verification.";
					isLoading = false;
					return;
				}

				message = "Login successful! Redirecting...";
				setTimeout(() => {
					window.location.href = "/dashboard";
				}, 1000);
			}
		}

		isLoading = false;
	}

	/** Handle Azure sign in */
	async function handleAzureSignIn() {
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "azure",
				options: {
					scopes: "email openid profile",
					redirectTo: `https://eqkwwbmbswmpjpfzttov.supabase.co/auth/v1/callback`,
				},
			});

			if (error) {
				message = `Failed to initiate Azure login: ${error.message}`;
				console.error("Azure login initiation error:", error);
				return;
			}

			message = "Redirecting to Azure login...";
		} catch (err) {
			console.error("Error during Azure sign-in:", err);
			message = "Unexpected error occurred. Please try again.";
		}
	}
</script>

<div class="min-h-screen grid lg:grid-cols-2 transition-colors duration-300 dark:bg-gray-900">
	<!-- Theme Toggle Button -->
	<button onclick={toggleTheme} class="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 z-50" aria-label="Toggle theme">
		{#if isDark}
			<Sun class="w-5 h-5 text-yellow-500" />
		{:else}
			<Moon class="w-5 h-5 text-gray-700" />
		{/if}
	</button>

	<!-- Left Section -->
	<div class="relative hidden lg:block bg-cover bg-center" style="background-image: linear-gradient(180deg, rgba(103, 21, 21, 0.8) 0%, rgba(103, 21, 21, 0.3) 50%), url('/images/login_bg.png');">
		<div class="relative z-10 h-full flex flex-col items-center justify-center space-y-4 p-10">
			<div class="text-center">
				<h1 class="text-5xl font-extrabold text-white tracking-tight mb-4">EuCorp</h1>
				<p class="text-xl text-gray-300 max-w-md">Our Institutional Planning System</p>
			</div>
			<div class="mt-6 space-y-2 text-gray-200">
				<div class="flex items-center space-x-2">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
					</svg>
					<p>Streamline Project Management</p>
				</div>
				<div class="flex items-center space-x-2">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
					</svg>
					<p>Enhance Collaboration</p>
				</div>
				<div class="flex items-center space-x-2">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
					</svg>
					<p>Monitor Progress Effectively</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Right Section -->
	<div class="flex items-center justify-center px-8">
		<div class="w-full max-w-md">
			<div class="text-center mb-8">
				<h1 class="text-2xl font-semibold dark:text-white">
					{isLogin ? "Login" : "Create an Account"}
				</h1>
				<p class="text-gray-600 dark:text-gray-400">
					{isLogin ? "Sign in to continue" : "Enter your details to register"}
				</p>
			</div>

			<form onsubmit={handleAuth} class="space-y-4">
				{#if !isLogin}
					<div class="flex gap-4">
						<input type="text" bind:value={firstName} placeholder="First Name" required class="input input-bordered w-full dark:bg-gray-800 dark:text-white dark:border-gray-700" />
						<input type="text" bind:value={lastName} placeholder="Last Name" required class="input input-bordered w-full dark:bg-gray-800 dark:text-white dark:border-gray-700" />
					</div>
				{/if}

				<input type="email" bind:value={email} placeholder="name@example.com" required class="input input-bordered w-full dark:bg-gray-800 dark:text-white dark:border-gray-700" />

				<div class="relative">
					<input type={showPassword ? "text" : "password"} bind:value={password} placeholder="Password" required class="input input-bordered w-full dark:bg-gray-800 dark:text-white dark:border-gray-700" />
					<button type="button" class="absolute inset-y-0 right-4 flex items-center dark:text-gray-400" onclick={() => (showPassword = !showPassword)}>
						{#if showPassword}
							<EyeOff class="w-5 h-5" />
						{:else}
							<Eye class="w-5 h-5" />
						{/if}
					</button>
				</div>

				{#if !isLogin}
					<div class="relative">
						<input type={showPassword ? "text" : "password"} bind:value={confirmPassword} placeholder="Confirm Password" required class="input input-bordered w-full dark:bg-gray-800 dark:text-white dark:border-gray-700" />
						<button type="button" class="absolute inset-y-0 right-4 flex items-center dark:text-gray-400" onclick={() => (showPassword = !showPassword)}>
							{#if showPassword}
								<EyeOff class="w-5 h-5" />
							{:else}
								<Eye class="w-5 h-5" />
							{/if}
						</button>
					</div>
				{/if}

				<button type="submit" class="btn bg-rose-700 w-full text-white hover:bg-rose-800 dark:bg-rose-800 dark:hover:bg-rose-900" disabled={isLoading}>
					{#if isLoading}
						<span class="loading loading-spinner loading-sm"></span>
					{/if}
					<span>{isLoading ? "Processing..." : isLogin ? "Login" : "Register"}</span>
				</button>
			</form>

			{#if message}
				<p class="text-sm text-center mt-4 text-error dark:text-red-400">{message}</p>
			{/if}

			<div class="divider dark:text-gray-400">OR</div>

			<button type="button" class="btn bg-blue-600 w-full text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 flex items-center justify-center space-x-2" onclick={handleAzureSignIn}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-5 h-5" fill="none">
					<path d="M126.23 14.7L0 207.43h71.54L126.23 80.7l54.7 126.74h71.54L126.23 14.7Z" fill="#0078D4" />
					<path d="M88.73 213.22H176l-44.76-79.55-42.51 79.55Z" fill="#008AD7" />
					<path d="M176 213.22H252L200.28 127l-24.28 86.22Z" fill="#0079B7" />
				</svg>
				<span>Sign in with Azure</span>
			</button>

			<p class="text-sm text-center mt-4 dark:text-gray-400">
				{#if isLogin}
					Don't have an account?
					<button onclick={() => (isLogin = false)} class="text-primary dark:text-blue-400 font-medium">Register</button>
				{:else}
					Already have an account?
					<button onclick={() => (isLogin = true)} class="text-primary dark:text-blue-400 font-medium">Login</button>
				{/if}
			</p>
		</div>
	</div>
</div>

<style>
	:global(html) {
		@apply transition-colors duration-300;
	}
	:global(html.dark) {
		@apply bg-gray-900;
	}
</style>
