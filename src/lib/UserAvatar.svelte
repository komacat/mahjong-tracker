<script lang="ts">
    import type { User } from '@prisma/client'

    export let user: User | undefined
    export let size: 'sm' | 'md' | 'lg' = 'md'

    const sizeToClassMap = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    }
</script>

{#if user}
    <div class={`overflow-hidden rounded-full ${sizeToClassMap[size]}`}>
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
