<script lang="ts">
    import type { EventAttendee, User } from '@prisma/client'
    
	export let usersList: User[] = []
    export const attendees: EventAttendee[] = []

    console.log(usersList)

    let query: string = ""

    function search(query: string): User[] {
        return usersList.filter(user => user.username.toLowerCase().includes(query.toLowerCase()));
    }

    $: searchResult = search(query)
</script>

<div class="py-4">
    <div class="relative flex flex-row space-x-2 px-2">
        <input
            type="text"
            bind:value={query}
            placeholder="Search by Discord Username"
            class="peer w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        />
        <div
            class="absolute -left-1 top-10 hidden w-[calc(100%-4rem)] flex-col divide-y rounded-lg border border-gray-300 bg-gray-50 p-2 shadow-lg peer-focus:flex"
        >
            {#if searchResult.length > 0}
                {#each searchResult as user}
                    <button
                        on:mousedown={() => ({})}
                        class="flex flex-row items-center space-x-2 py-4"
                    >
                        <img
                            src="https://cdn.discordapp.com/avatars/{user.id}/{user.avatar}.webp"
                            alt="avatar of {user.username}"
                            class="h-8 w-8 rounded-full"
                        />
                        <p>{user.username}</p>
                    </button>
                {/each}
            {:else}
                <p>No result</p>
            {/if}
        </div>
    </div>
</div>