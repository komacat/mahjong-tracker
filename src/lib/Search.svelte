<script lang="ts">
    import type { EventAttendee, User } from '@prisma/client'
    import UserAvatar from './UserAvatar.svelte'

    export let usersList: User[] = []
    export let attendees: EventAttendee[] = []
    export let join: (user: string) => Promise<void>

    let query: string = ''

    function search(query: string): User[] {
        return usersList.filter((user) => {
            const attendee = attendees.find((attendee) => attendee.userId === user.id)
            return (
                user.username.toLowerCase().includes(query.toLowerCase()) &&
                (!attendee || attendee.status === 'REJECTED')
            )
        })
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
            on:focus={() => {
                searchResult = search(query)
            }}
        />
        <div
            class="absolute -left-1 top-10 hidden w-[calc(100%-0.5rem)] flex-col divide-y rounded-lg border border-gray-300 bg-gray-50 p-2 shadow-lg peer-focus:flex"
        >
            {#if searchResult.length > 0}
                {#each searchResult as user}
                    <button
                        on:mousedown={async () => join(user.id)}
                        class="flex flex-row items-center space-x-2 py-4"
                    >
                        <UserAvatar {user} />
                        <p>{user.username}</p>
                    </button>
                {/each}
            {:else}
                <p>No result</p>
            {/if}
        </div>
    </div>
</div>
