import { error, type RequestHandler } from "@sveltejs/kit";
import prisma from "$lib/server/prisma";

export const POST = (async ({ params, request }) => {
    const userId = await request.text()

    const eventID = +(params.event ?? NaN)

    if (isNaN(eventID)) {
        error(404, 'Event not found');
    }

    const event = await prisma.event.findUnique({
        where: {
            id: eventID
        }
    });

    if (event == null) {
        error(404, 'Event not found');
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if (user == null) {
        error(404, 'User not found');
    }

    await prisma.eventAttendee.upsert({
        where: {
            userId_eventId: {
                userId: user.id,
                eventId: event.id
            }
        },
        update: {
            status: 'PENDING'
        },
        create: {
            status: 'PENDING',
            user: {
                connect: {
                    id: user.id
                }
            },
            event: {
                connect: {
                    id: event.id
                }
            }
        }
    })

    return new Response()
}) satisfies RequestHandler