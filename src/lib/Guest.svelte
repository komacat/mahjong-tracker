<script lang="ts">

    export let showGuest;
    export let toggleGuest: () => void;

    let usernameInput: HTMLInputElement;

    async function handleGuestSubmit() {
        const username = usernameInput.value;

        const response = await fetch('/api/guest/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });

        if (response.ok) {
            console.log("registered guest: ", username)
            toggleGuest();
        } else {
            console.error('Failed to register guest');
        }
    }
</script>

{#if showGuest}
<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-sm">
    <div class="p-6 bg-white rounded-lg shadow-lg">
        <h1 class="text-2xl font-semibold mb-4">Use Guest Profile
        </h1>
        <p class="mb-4">
            <input bind:this={usernameInput} type="text" class="px-4 py-2 rounded-lg" placeholder="username">
            <button
            on:click={handleGuestSubmit}
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Submit
        </button>
        </p>

        <button class="" on:click={toggleGuest}>Cancel</button>
    </div>
</div>
{/if}