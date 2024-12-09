<script lang="ts">
    import "tailwindcss/tailwind.css";
    import { supabase } from '$lib/supabaseClient';

    export let data: { session: any };
    const { session } = data;

    let profile: { first_name?: string; last_name?: string; role?: string; profile_pic?: string; email?: string } | null = null;
    let loading = true;
    let saving = false;
    let profilePicFile: File | null = null;
    let uploadedImageUrl: string | null = null;

    // Fetch the user's profile details
    const fetchUserProfile = async () => {
        if (session) {
            const { user } = session;
            const { data, error } = await supabase
                .from("profiles")
                .select("first_name, last_name, email, role, profile_pic")
                .eq("id", user.id)
                .single();

            if (error) {
                console.error("Error fetching user profile:", error.message);
            } else {
                profile = data;
                uploadedImageUrl = profile.profile_pic || null; // Load the initial profile picture
            }
        }
        loading = false; 
    };

    // Save updated profile details, including profile picture if uploaded
    const saveProfile = async () => {
        if (profile && session) {
            saving = true;
            const { user } = session;

            // Upload profile picture if a new file is selected
            let profilePicUrl = profile.profile_pic;
            if (profilePicFile) {
                console.log("Uploading new profile picture...");
                const { data: uploadData, error: uploadError } = await supabase
                    .storage
                    .from("profile-pictures")
                    .upload(`public/${user.id}/${profilePicFile.name}`, profilePicFile, {
                        cacheControl: "3600",
                        upsert: true
                    });

                if (uploadError) {
                    console.error("Error uploading profile picture:", uploadError.message);
                } else if (uploadData) {
                    console.log("Upload successful:", uploadData);
                    profilePicUrl = supabase.storage.from("profile-pictures").getPublicUrl(uploadData.path).data.publicUrl;
                    console.log("Public URL of profile picture:", profilePicUrl);
                    uploadedImageUrl = profilePicUrl; // Display the uploaded image
                }
            }

            // Update profile details in the database
            const { error } = await supabase
                .from("profiles")
                .update({
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    email: profile.email,
                    profile_pic: profilePicUrl
                })
                .eq("id", user.id);

            if (error) {
                console.error("Error updating profile:", error.message);
            } else {
                console.log("Profile updated successfully!");
                alert("Profile updated successfully!");
            }
            saving = false;
        }
    };

    // Handle profile picture selection
    const handleProfilePicChange = async (event: Event) => {
        const target = event.target as HTMLInputElement;
        profilePicFile = target.files ? target.files[0] : null;
        if (profilePicFile) {
            console.log("Selected file for upload:", profilePicFile.name);

            // Automatically upload and update the profile picture
            saveProfile();
        }
    };

    fetchUserProfile();
</script>

<div class="hero min-h-screen overflow-y-auto">
    <div class="hero-content flex flex-col items-center justify-center">
        <div class="max-w-md text-center">
            {#if loading}
                <span class="loading loading-spinner loading-sm"></span>
                <p class="">Loading...</p>
            {:else if session !== null && profile}
                <h1 class=" font-bold text-4xl">Edit Profile</h1>
                {#if uploadedImageUrl}
                    <img src={uploadedImageUrl} alt="Profile Picture" class="rounded-full w-32 h-32 mx-auto mb-4" />
                {/if}
                <form on:submit|preventDefault={saveProfile} class="mt-4">
                    <div class="mb-4">
                        <label for="profile-pic" class=" mb-2 cursor-pointer">Profile Picture</label>
                        <div class="relative">
                            <input id="profile-pic" type="file" accept="image/*" on:change={handleProfilePicChange} class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <button type="button" class="w-full py-2 px-4 border border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-200 focus:outline-none text-gray-700">
                                {#if uploadedImageUrl}Change Image{:else}Upload Image{/if}
                            </button>
                        </div>
                    </div>
                    <div class="mb-4">
                        <label for="first-name" class="">First Name</label>
                        <input id="first-name" type="text" bind:value={profile.first_name} placeholder="Enter first name" class="input input-bordered w-full" />
                    </div>
                    <div class="mb-4">
                        <label for="last-name" class="">Last Name</label>
                        <input id="last-name" type="text" bind:value={profile.last_name} placeholder="Enter last name" class="input input-bordered w-full" />
                    </div>
                    <div class="mb-4">
                        <label for="role" class="">Role</label>
                        <input id="role" type="text" value={profile.role} disabled class="input input-bordered w-full bg-gray-100" />
                    </div>
                    <button type="submit" class="btn btn-primary w-full" disabled={saving}>
                        {#if saving}Saving...{:else}Save Profile{/if}
                    </button>
                </form>
            {/if}
        </div>
    </div>
</div>
