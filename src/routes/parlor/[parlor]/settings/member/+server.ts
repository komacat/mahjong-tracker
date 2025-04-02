import { error } from "@sveltejs/kit";
import prisma from "$lib/server/prisma";
import { validateCaptcha } from "$lib/server/captcha";

export const POST = (async ({ params, request }) => {
    const parlorId = +(params.parlor ?? NaN)

    if (isNaN(parlorId)) {
        error(400, 'Invalid event')
    }

    const data = await request.json()

    if (!validateCaptcha(data.token)) {
        error(400, 'Invalid captcha')
    }

    const userId = data.user

    if (userId == null) {
        error(400, 'User ID is required')
    }

    const action = data.action

    switch (action) {
        case 'accept':
            await prisma.parlorMember.update({
                where: {
                    userId_parlorId: {
                        userId,
                        parlorId
                    }
                },
                data: {
                    status: 'ACCEPTED'
                }
            })
            break
        case 'reject':
            await prisma.parlorMember.update({
                where: {
                    userId_parlorId: {
                        userId,
                        parlorId
                    }
                },
                data: {
                    status: 'REJECTED'
                }
            })
            break
        case 'remove':
            await prisma.parlorMember.delete({
                where: {
                    userId_parlorId: {
                        userId,
                        parlorId
                    }
                }
            })
            break
        default:
            error(400, 'Invalid action')
    }

    return new Response()
})