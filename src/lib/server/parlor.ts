import { getUserById } from './user'
import { db, oneOrNull } from './drizzle'
import { parlor} from './drizzle/schema'
import { eq, getTableColumns } from 'drizzle-orm'

export async function registerParlor({
    name,
    location,
    owner,
    website,
    note,
}: {
    name: string
    location: string
    owner: string
    website?: string
    note: string
}) {
    const newParlor = await db
        .insert(parlor)
        .values({
            name,
            location,
            owner,
            website,
            note,
        })
        .returning()
    return newParlor[0]
}

export async function listParlors() {
    return await Promise.all(
        (await db.select({ ...getTableColumns(parlor) }).from(parlor)).map(async (parlor) => ({
            ...parlor,
            ownerInfo: await getUserById(parlor.owner),
        }))
    )
}

export async function getParlor(id: number) {
    const currentParlor = await db.select({ ...getTableColumns(parlor)}).from(parlor).where(eq(parlor.id, id)).limit(1).then(oneOrNull)
    if (!currentParlor) {
        return null
    }

    return {
        ...currentParlor,
        ownerInfo: await getUserById(currentParlor.owner),
    }
}
