import { refreshToken } from './discord'
import prisma from './prisma'
import { db, oneOrNull, type User } from './drizzle'
import { user, userToken } from './drizzle/schema'
import { eq, getTableColumns } from 'drizzle-orm'

function registerUser({
    id,
    username,
    avatar,
}: {
    id: string
    username: string
    avatar: string | null
}) {
    return prisma.user.upsert({
        where: { id },
        update: { username, avatar },
        create: { id, username, avatar },
    })
}

export async function getUser(sessionId: string): Promise<User | null> {
    return db.select({ ...getTableColumns(user) }).from(userToken).innerJoin(user, eq(user.id, userToken.userId)).where(eq(userToken.sessionId, sessionId)).limit(1).then(oneOrNull)
}

export async function getUserById(userId: string) {
    return prisma.user.findUnique({ where: { id: userId } })
}

export async function registerUserToken({
    sessionId,
    accessToken,
    refreshToken,
    expiresAt,
}: {
    sessionId: string
    accessToken: string
    refreshToken: string
    expiresAt: Date
}) {
    const user = await fetch(`https://discord.com/api/users/@me`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    }).then((res) => res.json())

    await registerUser({
        id: user.id,
        username: user.username,
        avatar: user.avatar,
    })

    return prisma.userToken.upsert({
        where: { sessionId },
        update: {
            userId: user.id,
            accessToken,
            refreshToken,
            expiresAt,
        },
        create: {
            userId: user.id,
            sessionId,
            accessToken,
            refreshToken,
            expiresAt,
        },
    })
}

export async function removeUserToken(sessionId: string) {
    return prisma.userToken.delete({
        where: { sessionId },
    })
}

export async function getUserToken(sessionId: string) {
    const userToken = await prisma.userToken.findUnique({
        where: { sessionId },
    })

    if (!userToken) {
        return null
    }

    const { expiresAt } = userToken

    if (expiresAt < new Date()) {
        return null
    }

    if (expiresAt.getTime() + 3600 * 1000 < new Date().getTime()) {
        const newToken = await refreshToken(userToken.refreshToken)

        registerUserToken({ sessionId, ...newToken })

        return newToken.accessToken
    }

    return userToken.accessToken
}
