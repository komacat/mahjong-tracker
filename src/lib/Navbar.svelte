<script lang="ts">
	import type { User } from '@prisma/client'
	import Guest from '$lib/Guest.svelte'
	import { fade } from 'svelte/transition'

	export let user: User | null = null
	let menuOpened = false
	let showGuest = false

	function close() {
		menuOpened = false
	}
	
	function toggleGuest() {
		showGuest = !showGuest;
	}
</script>

<Guest {showGuest} {toggleGuest}/>
<nav class="sticky top-0 z-50 flex flex-row items-center justify-between border-b bg-white p-4">
	<a href="/" class="font-extrabold tracking-tight">Mahjong Tracker</a>

	<div class="flex flex-row space-x-8 p-2">
		{#if user != null}
			<button on:click={() => (menuOpened = !menuOpened)}>
				<img
					src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp` : '/default_avatar.jpg'}
					alt="avatar of {user.username}"
					class="h-12 w-12 rounded-full"
				/>
			</button>
		{:else}
			<a href="/login" class="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-white"
				>Login</a
			>
		{/if}
	</div>
</nav>
{#if menuOpened}
	<div
		transition:fade={{ duration: 150 }}
		class="fixed top-0 z-10 h-full w-full bg-white pt-24 transition-opacity"
	>
		<ul class="border-t text-2xl font-medium">
			<li>
				<a on:click={close} href="/parlor" class="flex items-center p-8"> Parlors </a>
			</li>
			<li data-sveltekit-preload-data="false">
				{#if user}
					<a data-sveltekit-reload href="/logout" class="flex items-center p-8">Logout</a>
				{:else}
					<a href="/login" class="flex items-center p-8">Login</a>
				{/if}
			</li>
		</ul>
	</div>
{/if}
