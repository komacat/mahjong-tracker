import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import prisma from "$lib/server/prisma";
import { getSessionId } from "$lib/server/session";
import { getUser } from "$lib/server/user";

export const load = (async ({ cookies, params }) => {
    const parlorId = +(params.parlor ?? NaN)

    if (isNaN(parlorId)) {
        error(400, 'Invalid parlor')
    }

    const sessionId = getSessionId(cookies);

    const user = await getUser(sessionId);

    const joinRequest = user && (await prisma.parlorMember.findUnique({
        where: {
            userId_parlorId: {
                userId: user.id,
                parlorId: parlorId
            }
        }
    }))

    const members = await prisma.parlorMember.findMany({
        where: {
            status: 'ACCEPTED'
        },
        include: {
            user: true
        }
    })


    const events = await prisma.event.findMany({
        where: {
            parlorId
        }
    })

    return { events, members, joinRequestStatus: joinRequest?.status }
}) satisfies PageServerLoad;