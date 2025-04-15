import type { User } from '@prisma/client'
import { refreshToken } from './discord'
import prisma from './prisma'
import { v5 as uuidv5 } from 'uuid'

const NAMESPACE_GUEST = 'e17fa822-f705-43fc-beaa-dcd14e13c4e0'

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
    return (
        (
            await prisma.userToken.findUnique({
                where: { sessionId },
                include: { user: true },
            })
        )?.user ?? null
    )
}

export async function getUserById(userId: string) {
    return prisma.user.findUnique({ where: { id: userId } })
}

export async function getAllUsers(): Promise<User[]> {
    return await prisma.user.findMany()
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

async function generateGuestUUID(username: string) {
    return uuidv5(username, NAMESPACE_GUEST)
}

export async function registerGuest(username: string) {
    const userId = await generateGuestUUID(username)

    let user = await prisma.user.findUnique({
        where: { id: userId },
    })

    if (!user) {
        user = await prisma.user.create({
            data: {
                id: userId,
                username: username,
                avatar: null,
            },
        })
    }

    return user
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
