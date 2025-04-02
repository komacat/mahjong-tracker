import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import prisma from '$lib/server/prisma'

export const load = (async ({ params }) => {
    const parlorId = +(params.parlor ?? NaN)

    if (isNaN(parlorId)) {
        error(404, 'Event not found')
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

    return {
        members: members.map(member => member.user)
    }
}) satisfies PageServerLoad