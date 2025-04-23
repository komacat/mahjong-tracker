import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    dialect: 'postgresql',
    out: './src/lib/server/drizzle',
    schema: './src/lib/server/drizzle/schema.ts',
    dbCredentials: {
        host: process.env.DB_HOST!,
        port: Number(process.env.DB_PORT!),
        user: process.env.DB_USERNAME!,
        password: process.env.DB_PASSWORD!,
        database: process.env.DB_NAME!,
        ssl: false,
    },
    // Print all statements
    verbose: true,
    // Always ask for confirmation
    strict: true,
})
