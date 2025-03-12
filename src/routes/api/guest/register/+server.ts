import type { RequestHandler } from '@sveltejs/kit';
import { registerGuestToken } from '$lib/server/user';
import { getSessionId } from '$lib/server/session';

export const POST: RequestHandler = async ({ request, cookies }) => {
    const { username } = await request.json();
    const sessionId = getSessionId(cookies);

    await registerGuestToken(sessionId, username);

    return new Response(null, { status: 200 });
};