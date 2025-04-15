import prisma from '$lib/server/prisma'
import { error } from '@sveltejs/kit'

export async function isParlorAdmin(userId: string, parlorId: number): Promise<boolean> {
    const parlor = await prisma.parlor.findUnique({
        where: { id: parlorId },
        select: { owner: true },
    })

    if (!parlor) {
        throw error(404, 'Parlor not found')
    }

    return parlor.owner === userId
}

export async function isEventAdmin(userId: string, eventId: number): Promise<boolean> {
    const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: { parlor: { select: { owner: true } } },
    })

    if (!event) {
        throw error(404, 'Event not found')
    }

    return event.parlor.owner === userId
}
