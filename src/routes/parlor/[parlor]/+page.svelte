<script lang="ts">
    import { goto } from '$app/navigation'
    import { page } from '$app/stores'
    import type { PageData } from './$types'

    export let data: PageData

    let error = ''

    $: parlorId = $page.params.parlor

    async function createEvent() {
        console.log('awawaaa')
        const response = await fetch(`${parlorId}/auth`, {
            method: 'POST',
        })

        if (response.ok) {
            goto(`${parlorId}/create_event`)
        } else {
            console.log('errrmmmm')
            const body = await response.json()
            error = body.message
        }
    }
</script>

<main class="mx-auto max-w-2xl p-4">
    <section>
        <div class="flex flex-row items-center justify-between">
            <h1 class="text-2xl font-bold">{data.parlor.name}</h1>
            <a
                href="{data.parlor.id}/settings"
                class="material-symbols-rounded filled px-5 py-2.5 text-2xl">settings</a
            >
        </div>
        <div class="flex flex-row items-center space-x-4 py-4">
            {#if data.parlor.ownerInfo}<img
                    src="https://cdn.discordapp.com/avatars/{data.parlor.ownerInfo.id}/{data.parlor
                        .ownerInfo.avatar}.webp"
                    alt="avatar of {data.parlor.ownerInfo.username}"
                    class="h-8 w-8 rounded-full"
                />{/if}
            <p>
                {#if data.parlor.ownerInfo}{data.parlor.ownerInfo.username}{:else}unknown user {data
                        .parlor.owner}{/if}
            </p>
        </div>
    </section>
    <section>
        <div class="flex flex-row items-center justify-between">
            <h2 class="text-xl font-bold">Events</h2>
            <button
                type="button"
                on:click={createEvent}
                class="flex flex-row space-x-2 rounded-lg bg-blue-500 p-4 text-white"
            >
                <span class="material-symbols-rounded">add</span> New Event
            </button>
        </div>
        <div class="divide-y py-4">
            {#each data.events as event}
                <a href="/event/{event.id}" class="flex flex-row space-x-4 py-4">
                    <div class="flex flex-grow flex-col space-y-2">
                        <h2 class="text-xl font-semibold">{event.name}</h2>
                        {#if event.location}
                            <p class="flex flex-row items-center text-sm">
                                <span class="material-symbols-rounded mr-1 text-lg"
                                    >location_on</span
                                >
                                {event.location}
                            </p>
                        {/if}
                        <p class="text-sm">{event.description}</p>
                    </div>
                    <span class="material-symbols-rounded my-auto">chevron_right</span>
                </a>
            {/each}
        </div>
    </section>
    <div class="p-4">
        <p class="flex-1 text-right font-bold text-red-500">{error}</p>
    </div>
</main>
