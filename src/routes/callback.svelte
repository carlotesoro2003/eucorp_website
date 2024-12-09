<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
    import { goto } from '$app/navigation';

    onMount(async () => {
        const { data: { user: loggedInUser } } = await supabase.auth.getUser();
        if (loggedInUser) {
            console.log("User logged in:", loggedInUser);
            goto('/dashboard'); // Redirect to dashboard if logged in
        } else {
            console.log("No user logged in, redirecting to login.");
            goto('/login'); // Redirect to login if not logged in
        }
    });
</script>

<p>Logging you in...</p>
