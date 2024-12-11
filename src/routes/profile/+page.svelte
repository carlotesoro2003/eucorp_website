<script lang="ts">
	import { fade, fly } from "svelte/transition";
	import { Camera, Loader2, Mail, User } from "lucide-svelte";
	import { supabase } from "$lib/supabaseClient";

	// Define profile type for better type safety
	type Profile = {
		first_name?: string;
		last_name?: string;
		role?: string;
		profile_pic?: string;
		email?: string;
	};

	// Props and states
	let props = $props();
	let { session } = props.data;
	let profile: Profile | null = $state(null);
	let loading: boolean = $state(true);
	let saving: boolean = $state(false);
	let profilePicFile: File | null = $state(null);
	let uploadedImageUrl: string | null = $state(null);
	let isDragging: boolean = $state(false);

	// Track form changes
	let formChanged: boolean = $derived(profile !== null);

	/** Fetch user profile details */
	const fetchUserProfile = async () => {
		if (session) {
			const { user } = session;
			const { data, error } = await supabase.from("profiles").select("first_name, last_name, email, role, profile_pic").eq("id", user.id).single();

			if (error) {
				console.error("Error fetching user profile:", error.message);
			} else {
				profile = data;
				uploadedImageUrl = profile.profile_pic || null;
			}
		}
		loading = false;
	};

	/** Save updated profile details */
	const saveProfile = async () => {
		if (!profile || !session) return;

		saving = true;
		const { user } = session;

		try {
			let profilePicUrl = profile.profile_pic;

			if (profilePicFile) {
				const { data: uploadData, error: uploadError } = await supabase.storage.from("profile-pictures").upload(`public/${user.id}/${profilePicFile.name}`, profilePicFile, {
					cacheControl: "3600",
					upsert: true,
				});

				if (uploadError) throw uploadError;

				if (uploadData) {
					profilePicUrl = supabase.storage.from("profile-pictures").getPublicUrl(uploadData.path).data.publicUrl;
					uploadedImageUrl = profilePicUrl;
				}
			}

			const { error } = await supabase
				.from("profiles")
				.update({
					first_name: profile.first_name,
					last_name: profile.last_name,
					email: profile.email,
					profile_pic: profilePicUrl,
				})
				.eq("id", user.id);

			if (error) throw error;

			// Show success message
			const toast = document.createElement("div");
			toast.className = "fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg";
			toast.textContent = "Profile updated successfully!";
			document.body.appendChild(toast);
			setTimeout(() => toast.remove(), 3000);
		} catch (error) {
			console.error("Error:", error);
		} finally {
			saving = false;
		}
	};

	/** Handle profile picture selection */
	const handleProfilePicChange = async (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			profilePicFile = target.files[0];
			saveProfile();
		}
	};

	/** Handle drag and drop */
	const handleDrop = (event: DragEvent) => {
		event.preventDefault();
		isDragging = false;

		if (event.dataTransfer?.files.length) {
			profilePicFile = event.dataTransfer.files[0];
			saveProfile();
		}
	};

	// Fetch profile on mount
	fetchUserProfile();
</script>

<div class="min-h-screen bg-gray-50 text-gray-900 w-full py-8 px-4">
	<div class="max-w-2xl mx-auto">
		{#if loading}
			<!-- Loading state -->
			<div class="flex flex-col items-center justify-center h-[60vh] gap-3" in:fade>
				<Loader2 class="w-8 h-8 animate-spin text-primary" />
				<p class="text-lg text-gray-600">Loading your profile...</p>
			</div>
		{:else if session !== null && profile}
			<!-- Profile form -->
			<div class="bg-white rounded-xl shadow-sm p-6 md:p-8" in:fly={{ y: 20, duration: 600 }}>
				<h1 class="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>

				<form onsubmit={saveProfile} class="space-y-6">
					<!-- Profile picture section -->
					<div class="flex flex-col items-center gap-4">
						<div
							class="relative group cursor-pointer"
							ondragover={(e) => {
								e.preventDefault();
								isDragging = true;
							}}
							ondragleave={() => (isDragging = false)}
							ondrop={handleDrop}
						>
							<div class={`w-32 h-32 rounded-full overflow-hidden border-4 transition-all duration-300 ${isDragging ? "border-primary scale-105" : "border-gray-100"}`}>
								{#if uploadedImageUrl}
									<img src={uploadedImageUrl} alt="Profile" class="w-full h-full object-cover" />
								{:else}
									<div class="w-full h-full bg-gray-100 flex items-center justify-center">
										<User class="w-12 h-12 text-gray-400" />
									</div>
								{/if}
							</div>

							<!-- Upload overlay -->
							<div class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
								<Camera class="w-8 h-8 text-white" />
							</div>

							<input type="file" accept="image/*" onchange={handleProfilePicChange} class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
						</div>
						<p class="text-sm text-gray-500">Drag and drop or click to change profile picture</p>
					</div>

					<!-- Form fields -->
					<div class="grid md:grid-cols-2 gap-6">
						<div class="space-y-2">
							<label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
							<input id="firstName" type="text" bind:value={profile.first_name} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" placeholder="Enter your first name" />
						</div>

						<div class="space-y-2">
							<label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
							<input id="lastName" type="text" bind:value={profile.last_name} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors" placeholder="Enter your last name" />
						</div>

						<div class="space-y-2">
							<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
							<div class="relative">
								<Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
								<input id="email" type="email" value={profile.email ?? ""} disabled class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500" />
							</div>
						</div>

						<div class="space-y-2">
							<label for="role" class="block text-sm font-medium text-gray-700">Role</label>
							<input id="role" type="text" value={profile.role ?? "User"} disabled class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500" />
						</div>
					</div>

					<!-- Save button -->
					<div class="flex justify-end pt-4">
						<button type="submit" disabled={saving} class="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
							{#if saving}
								<Loader2 class="w-4 h-4 animate-spin" />
								Saving...
							{:else}
								Save Changes
							{/if}
						</button>
					</div>
				</form>
			</div>
		{/if}
	</div>
</div>
