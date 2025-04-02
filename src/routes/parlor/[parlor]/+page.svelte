<script lang="ts">
	import type { PageData } from './$types'
	import { invalidateAll } from '$app/navigation'
	import { PUBLIC_CAPTCHA_CLIENT_KEY } from '$env/static/public'
	import { onMount } from 'svelte'

	export let data: PageData

	onMount(() => {
		const refresh = setInterval(() => {
			invalidateAll()
		}, 5000)

		return () => clearInterval(refresh)
	})
	
	async function join() {
	console.log("awaaw")
	window.grecaptcha.ready(() => {
		window.grecaptcha
			.execute(PUBLIC_CAPTCHA_CLIENT_KEY, { action: 'submit' })
			.then(async (token) => {
				await fetch(`${data.parlor.id}/join`, { method: 'POST', body: token })
				invalidateAll()
			})
	})
	}
</script>

<main class="mx-auto max-w-2xl p-4">
	<section>
	<section class="p-4">
		<div class="flex flex-row items-center">
			<h1 class="mr-auto text-2xl font-bold">{data.parlor.name}</h1>
			{#if data.joinRequestStatus === 'PENDING'}
				<p class="flex flex-row items-center p-4 text-sm text-violet-500">
					<span class="material-symbols-rounded mr-2">hourglass</span>Join request pending
				</p>
			{:else if data.joinRequestStatus === 'ACCEPTED'}
				<p class="flex flex-row items-center text-sm text-green-500">
					<span class="material-symbols-rounded mr-2">check</span>Joined
				</p>
			{:else if data.joinRequestStatus === 'REJECTED'}
				<button
					on:click={join}
					class="flex flex-row items-center rounded-lg border border-red-500 p-4 text-sm text-red-500 transition duration-300 hover:bg-red-500 hover:text-white"
				>
					<span class="material-symbols-rounded mr-2">close</span>Join request rejected
				</button>
			{:else}
				<button on:click={join} class="flex flex-row rounded-lg bg-blue-500 p-4 text-white">
					<span class="material-symbols-rounded mr-2">people</span> Join
				</button>
			{/if}
			<a
				href="{data.parlor.id}/settings"
				class="material-symbols-rounded filled px-5 py-2.5 text-2xl">settings</a
			>
		</div>
	</section>
		<div class="flex flex-row items-center space-x-4 py-4">
			{#if data.parlor.ownerInfo}<img
					src="https://cdn.discordapp.com/avatars/{data.parlor.ownerInfo.id}/{data.parlor.ownerInfo
						.avatar}.webp"
					alt="avatar of {data.parlor.ownerInfo.username}"
					class="h-8 w-8 rounded-full"
				/>{/if}
			<p>
				{#if data.parlor.ownerInfo}{data.parlor.ownerInfo.username}{:else}unknown user {data.parlor
						.owner}{/if}
			</p>
		</div>
	</section>
	<section>
		<div class="flex flex-row items-center justify-between">
			<h2 class="text-xl font-bold">Events</h2>
			<a
				href="{data.parlor.id}/create_event"
				class="flex flex-row space-x-2 rounded-lg bg-blue-500 p-4 text-white"
			>
				<span class="material-symbols-rounded">add</span> New Event
			</a>
		</div>
		<div class="divide-y py-4">
			{#each data.events as event}
				<a href="/parlor/{data.parlor.id}/event/{event.id}" class="flex flex-row space-x-4 py-4">
					<div class="flex flex-grow flex-col space-y-2">
						<h2 class="text-xl font-semibold">{event.name}</h2>
						{#if event.location}
							<p class="flex flex-row items-center text-sm">
								<span class="material-symbols-rounded mr-1 text-lg">location_on</span>
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
</main>
