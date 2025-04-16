<script lang="ts">
	import type { User } from '@prisma/client'

	export let user: User | undefined
	export let size: number = 8
</script>

{#if user}
	<div class="h-{size} w-{size} overflow-hidden rounded-full">
		<object
			data="https://cdn.discordapp.com/avatars/{user.id}/{user.avatar}.webp"
			type="image/webp"
			title="avatar of {user.username}"
			class="h-full w-full"
		>
			<img
				src="https://cdn.discordapp.com/emojis/1235123039956500491.webp?size=96"
				alt="avatar of {user.username}"
			/>
		</object>
	</div>
{/if}
