<script lang="ts">
	import "../app.css";
	import "tailwindcss/tailwind.css";
	import { supabase } from "$lib/supabaseClient";
	import Eye from "lucide-svelte/icons/eye";
	import EyeOff from "lucide-svelte/icons/eye-off";
	import Moon from "lucide-svelte/icons/moon";
	import Sun from "lucide-svelte/icons/sun";
	import { slide } from "svelte/transition";
	import { onMount } from "svelte";

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

	/** Check for authentication on mount */
	onMount(async () => {
		// Check if we have a session from Azure redirect
		const {
			data: { session },
			error,
		} = await supabase.auth.getSession();

		if (session) {
			// Check user verification status
			const { data: profile, error: profileError } = await supabase.from("profiles").select("is_verified").eq("id", session.user.id).single();

			if (!profileError && profile?.is_verified) {
				window.location.href = "/dashboard";
			}
		}
	});

	/** Handle authentication */
	async function handleAuth(e: SubmitEvent) {
		e.preventDefault();
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
				window.location.href = "/dashboard";
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
					redirectTo: window.location.origin + "/dashboard",
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
	<!-- Left Section -->
	<div class="relative hidden lg:block bg-cover bg-center" style="background-image: linear-gradient(180deg, rgba(103, 21, 21, 0.8) 0%, rgba(103, 21, 21, 0.3) 50%), url('/images/login_bg.png');">
		<!-- Brand Logo -->
		<div class="absolute top-8 left-8 z-20">
			<h1 class="text-4xl font-black text-white tracking-tight">Eucorp</h1>
			<p class="text-sm text-gray-200 mt-1">Institutional Planning System</p>
		</div>

		<!-- Features Section -->
		<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-10">
			<div class="max-w-md mx-auto space-y-8">
				<h2 class="text-2xl font-bold text-white">Transform Your Project Management</h2>
				<div class="space-y-4">
					<div class="flex items-center space-x-4 text-white/90 hover:text-white transition-colors group">
						<div class="p-2 bg-rose-600/20 rounded-lg group-hover:bg-rose-600/30 transition-colors">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<div>
							<h3 class="font-semibold">Streamline Project Management</h3>
							<p class="text-sm text-white/70">Efficiently manage projects and resources in one place</p>
						</div>
					</div>

					<div class="flex items-center space-x-4 text-white/90 hover:text-white transition-colors group">
						<div class="p-2 bg-blue-600/20 rounded-lg group-hover:bg-blue-600/30 transition-colors">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<div>
							<h3 class="font-semibold">Enhanced Collaboration</h3>
							<p class="text-sm text-white/70">Work together seamlessly with your team members</p>
						</div>
					</div>

					<div class="flex items-center space-x-4 text-white/90 hover:text-white transition-colors group">
						<div class="p-2 bg-green-600/20 rounded-lg group-hover:bg-green-600/30 transition-colors">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<div>
							<h3 class="font-semibold">Progress Monitoring</h3>
							<p class="text-sm text-white/70">Track and analyze project progress in real-time</p>
						</div>
					</div>
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
						<input type="text" bind:value={firstName} placeholder="First Name" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-800 dark:text-white dark:border-gray-700" />
						<input type="text" bind:value={lastName} placeholder="Last Name" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-800 dark:text-white dark:border-gray-700" />
					</div>
				{/if}

				<input type="email" bind:value={email} placeholder="name@example.com" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-800 dark:text-white dark:border-gray-700" />

				<div class="relative">
					<input type={showPassword ? "text" : "password"} bind:value={password} placeholder="Password" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-800 dark:text-white dark:border-gray-700" />
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
						<input type={showPassword ? "text" : "password"} bind:value={confirmPassword} placeholder="Confirm Password" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-800 dark:text-white dark:border-gray-700" />
					</div>
				{/if}

				<button type="submit" class="w-full px-4 py-2 text-white bg-rose-700 rounded-lg hover:bg-rose-800 focus:ring-4 focus:ring-rose-300 dark:bg-rose-800 dark:hover:bg-rose-900" disabled={isLoading}>
					{#if isLoading}
						<span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
					{/if}
					{isLoading ? "Processing..." : isLogin ? "Login" : "Register"}
				</button>
			</form>

			{#if message}
				<div transition:slide class="mt-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
					<p class="text-sm text-center text-red-700 dark:text-red-400">{message}</p>
				</div>
			{/if}

			<div class="relative my-6">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-gray-300 dark:border-gray-700"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="px-2 text-gray-500 bg-white dark:bg-gray-900 dark:text-gray-400">OR</span>
				</div>
			</div>

			<button type="button" onclick={handleAzureSignIn} class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50" disabled={isLoading}>
				{#if isLoading}
					<div class="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
				{:else}
					<svg class="w-5 h-5" viewBox="0 0 256 256" fill="none">
						<path d="M126.23 14.7L0 207.43h71.54L126.23 80.7l54.7 126.74h71.54L126.23 14.7Z" fill="#fff" />
						<path d="M88.73 213.22H176l-44.76-79.55-42.51 79.55Z" fill="#fff" />
						<path d="M176 213.22H252L200.28 127l-24.28 86.22Z" fill="#fff" />
					</svg>
				{/if}
				<span>{isLoading ? "Processing..." : "Sign in with Azure"}</span>
			</button>

			<p class="text-sm text-center mt-4 dark:text-gray-400">
				{#if isLogin}
					Don't have an account?
					<button onclick={() => (isLogin = false)} class="text-blue-600 hover:underline dark:text-blue-400 font-medium">Register</button>
				{:else}
					Already have an account?
					<button onclick={() => (isLogin = true)} class="text-blue-600 hover:underline dark:text-blue-400 font-medium">Login</button>
				{/if}
			</p>
		</div>
	</div>
</div>
