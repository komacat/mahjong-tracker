import { getSessionId } from "$lib/server/session";
import { getUser } from "$lib/server/user";
import { error, type RequestHandler } from "@sveltejs/kit";
import prisma from "$lib/server/prisma";
import { validateCaptcha } from "$lib/server/captcha";

export const POST = (async ({ cookies, params, request }) => {
    const cpatchaToken = await request.text()

    if (!validateCaptcha(cpatchaToken)) {
        error(400, 'Invalid captcha token')
    }

    const parlorId = +(params.parlor ?? NaN)

    if (isNaN(parlorId)) {
        error(404, 'Parlor not found');
    }

    const sessionId = getSessionId(cookies);
    const user = await getUser(sessionId);

    if (user == null) {
        error(401, 'Unauthorized');
    }

    const parlor = await prisma.parlor.findUnique({
        where: {
            id: parlorId
        }
    });

    if (parlor == null) {
        error(404, 'Parlor not found');
    }

    await prisma.parlorMember.upsert({
        where: {
            userId_parlorId: {
                userId: user.id,
                parlorId: parlor.id
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
            parlor: {
                connect: {
                    id: parlor.id
                }
            }
        }
    })

    return new Response()
}) satisfies RequestHandler