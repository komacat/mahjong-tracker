import { error } from '@sveltejs/kit'
import prisma from '$lib/server/prisma'
import { validateJoinPolicy } from '$lib/validator'
import { validateCaptcha } from '$lib/server/captcha'

export const POST = async ({ params, request }) => {
    const data = await request.formData()

    if (!validateCaptcha(data.get('token')?.toString())) {
        error(400, 'Invalid captcha')
    }

    const name = data.get('name')?.toString()

    const parlorId = +(params.parlor ?? NaN)

    if (isNaN(parlorId)) {
        error(400, 'Invalid parlor')
    }

    if (name == null || name.length < 3) {
        error(400, 'Name must be at least 3 characters long')
    }

    const rulesetId = +(data.get('ruleset')?.toString() ?? NaN)

    if (
        isNaN(rulesetId) ||
        (await prisma.ruleset.findUnique({ where: { id: rulesetId } }))?.parlorId !== parlorId
    ) {
        error(400, 'Invalid ruleset')
    }

    const joinPolicyType = data.get('joinPolicy')?.toString()
    const joinPolicyUntil = data.get('joinPolicyUntil')?.toString() || null

    const joinPolicy = {
        type: joinPolicyType,
        until: joinPolicyUntil
    }

    if (!validateJoinPolicy(joinPolicy)) {
        error(400, 'Invalid join policy')
    }

    const event = await prisma.event.create({
        data: {
            name,
            location: data.get('location')?.toString() ?? '',
            description: data.get('description')?.toString() ?? '',
            parlorId: +(params.parlor ?? NaN),
            rulesetId,
            joinPolicy
        }
    })

    return new Response(JSON.stringify({ eventId: event.id }))
}
