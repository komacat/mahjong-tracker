import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import prisma from "$lib/server/prisma";
import { getAllUsers } from "$lib/server/user";

export const load = (async ({ params }) => {
    const eventId = +(params.event ?? NaN)

    if (isNaN(eventId)) {
        error(400, 'Invalid event')
    }

    return {
        users: await getAllUsers(),
        attendee: await prisma.eventAttendee.findMany({
            where: {
                eventId
            },
            include: {
                user: true
            }
        })
    }
}) satisfies PageServerLoad