import { listParlors } from "$lib/server/parlor";
import { getUser } from "$lib/server/user";
import type { PageServerLoad } from "./$types";

export const load = (async ({ cookies }) => {
    const sessionId = cookies.get('SESSION_ID')
    let user = null;
    if (sessionId) {
        user = await getUser(sessionId)
    }

    return {
        parlors: await listParlors(),
        user: user

    }
}) satisfies PageServerLoad;