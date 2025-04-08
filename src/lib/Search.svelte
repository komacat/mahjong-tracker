<script lang="ts">
    import type { EventAttendee, User } from '@prisma/client'
    import UserAvatar from './UserAvatar.svelte'
    import type { PageData } from './$types'

    export let data: PageData
    export let join: (user: string) => Promise<void>

    let usersList: User[] = data.users

    let query: string = ''

    function search(query: string): User[] {
        return usersList.filter((user) => {
            const attendee = data.attendee.find(
                (attendee: EventAttendee) => attendee.userId === user.id
            )
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
            placeholder="Search or add by Discord username"
            class="peer w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            on:focus={() => {
                searchResult = search(query)
            }}
        />
        <button
            type="button"
            class="material-symbols-rounded ml-auto flex flex-row items-center rounded-lg bg-blue-500 p-2 text-white"
        >
            add</button
        >
        <div
            class="absolute -left-1 top-10 hidden w-[calc(100%-4rem)] flex-col divide-y rounded-lg border border-gray-300 bg-gray-50 p-2 shadow-lg peer-focus:flex"
        >
            {#if searchResult.length > 0}
                {#each searchResult as user}
                    <button
                        on:mousedown={() => join(user.id)}
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
