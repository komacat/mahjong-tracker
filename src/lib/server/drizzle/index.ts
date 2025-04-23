import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';

export const client = new pg.Client({
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    user: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
});

// { schema } is used for relational queries
export const db = drizzle({ client, schema });

export function oneOrNull<T>(x: T[]): T | null {
    if (x.length !== 1) return null
    return x[0]
}

export type User = typeof schema.user.$inferSelect