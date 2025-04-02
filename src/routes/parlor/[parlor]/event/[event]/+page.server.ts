import prisma from "$lib/server/prisma";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, url }) => {
    const parlorId = +(params.parlor ?? NaN);
    const eventId = +(params.event ?? NaN);

    if (isNaN(parlorId)) {
        error(404, 'Parlor not found')
    }
    if (isNaN(eventId)) {
        error(404, 'Parlor not found')
    }

    const page = +(url.searchParams.get('page') ?? '1');

    if (page < 1) {
        error(404, 'Page not found')
    }

    const members = await prisma.parlorMember.findMany({
        where: {
            parlorId,
            status: 'ACCEPTED'
        },
        include: {
            user: true
        }
    })

    const games = await prisma.game.findMany({
        where: {
            eventId
        },
        include: {
            players: {
                include: {
                    user: true
                },
                orderBy: {
                    index: 'asc'
                }
            }
        },
        orderBy: {
            id: 'desc'
        }
    })

    return { games, members }
}) satisfies PageServerLoad;