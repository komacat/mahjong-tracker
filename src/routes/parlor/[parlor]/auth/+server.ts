import { isParlorAdmin } from '$lib/server/auth'
import { getSessionId } from '$lib/server/session'
import { getUser } from '$lib/server/user'
import { error } from '@sveltejs/kit'

export const POST = async ({ cookies, params }) => {
    const parlorId = +(params.parlor ?? NaN)

    if (isNaN(parlorId)) {
        error(400, 'Invalid parlor')
    }

    const sessionId = getSessionId(cookies)
    const currentUser = await getUser(sessionId)
    if (!currentUser) {
        error(401, 'Unauthorized to perform this action.')
    }

    const isAdmin = await isParlorAdmin(currentUser.id, parlorId)
    if (!isAdmin) {
        error(401, 'Unauthorized to perform this action.')
    }
    return new Response()
}
