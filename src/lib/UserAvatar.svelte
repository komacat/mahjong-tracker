<script lang="ts">
	import type { User } from '@prisma/client'

	export let user: User | undefined
</script>

{#if user}
	<object
		data="https://cdn.discordapp.com/avatars/{user.id}/{user.avatar}.webp"
		type="image/webp"
		title="avatar of {user.username}"
		class="h-8 w-8 rounded-full"
	>
		<img
			src="https://cdn.discordapp.com/emojis/1235123039956500491.webp?size=96"
			alt="avatar of {user.username}"
		/>
	</object>
{/if}
