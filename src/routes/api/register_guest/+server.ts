import type { RequestHandler } from '@sveltejs/kit'
import { registerGuest } from '$lib/server/user'

export const POST: RequestHandler = async ({ request }) => {
    const username = await request.text()
    const user = await registerGuest(username)

    return new Response(JSON.stringify(user))
}
