import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import prisma from "$lib/server/prisma";

export const load = (async ({ params }) => {
    const parlorId = +(params.parlor ?? NaN)

    if (isNaN(parlorId)) {
        error(400, 'Invalid event')
    }

    return {
        member: await prisma.parlorMember.findMany({
            where: {
                parlorId
            },
            include: {
                user: true
            }
        })
    }
}) satisfies PageServerLoad