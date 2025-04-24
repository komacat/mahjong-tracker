import { refreshToken } from './discord'
import { db, oneOrNull, type User } from './drizzle'
import { user, userToken } from './drizzle/schema'
import { eq, getTableColumns } from 'drizzle-orm'
import { v5 as uuidv5 } from 'uuid'
import { usersSync } from 'drizzle-orm/neon'

const NAMESPACE_GUEST = 'e17fa822-f705-43fc-beaa-dcd14e13c4e0'

async function registerUser({
    id,
    username,
    avatar,
}: {
    id: string
    username: string
    avatar: string | null
}) {
    await db
        .insert(user)
        .values({ id, username, avatar })
        .onConflictDoUpdate({ target: user.id, set: { username, avatar } })
    return getUserById(id)
}

export async function getUser(sessionId: string): Promise<User | null> {
    return db
        .select({ ...getTableColumns(user) })
        .from(userToken)
        .innerJoin(user, eq(user.id, userToken.userId))
        .where(eq(userToken.sessionId, sessionId))
        .limit(1)
        .then(oneOrNull)
}

export async function getUserById(userId: string) {
    return db
        .select({ ...getTableColumns(user) })
        .from(user)
        .where(eq(user.id, userId))
        .limit(1)
        .then(oneOrNull)
}

export async function getAllUsers(): Promise<User[]> {
    return db.select().from(user)
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

    return db
        .insert(userToken)
        .values({
            userId: user.id,
            sessionId,
            accessToken,
            refreshToken,
            expiresAt: expiresAt.toISOString(),
        })
        .onConflictDoUpdate({
            target: userToken.sessionId,
            set: { userId: user.id, accessToken, refreshToken, expiresAt: expiresAt.toISOString() },
        })
        .returning()
}

async function generateGuestUUID(username: string) {
    return uuidv5(username, NAMESPACE_GUEST)
}

export async function registerGuest(username: string) {
    const userId = await generateGuestUUID(username)

    const currentGuest = db
        .select({ ...getTableColumns(user) })
        .from(user)
        .where(eq(user.id, userId))

    if (!currentGuest) {
        return db
            .insert(user)
            .values({ id: userId, username, avatar: null })
            .onConflictDoUpdate({ target: user.id, set: { username, avatar: null } })
            .returning()
    }

    return currentGuest
}

export async function removeUserToken(sessionId: string) {
    return db.delete(userToken).where(eq(userToken.sessionId, sessionId))
}

export async function getUserToken(sessionId: string) {
    const currentUserToken = await db
        .select({ ...getTableColumns(userToken) })
        .from(userToken)
        .where(eq(userToken.sessionId, sessionId))
        .limit(1)
        .then(oneOrNull)

    if (!currentUserToken) {
        return null
    }

    const { expiresAt } = currentUserToken

    const expiresAtDate = new Date(expiresAt)

    if (expiresAtDate < new Date()) {
        return null
    }

    if (expiresAtDate.getTime() + 3600 * 1000 < new Date().getTime()) {
        const newToken = await refreshToken(currentUserToken.refreshToken)

        registerUserToken({ sessionId, ...newToken })

        return newToken.accessToken
    }

    return currentUserToken.accessToken
}
