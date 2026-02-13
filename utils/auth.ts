import {betterAuth} from "better-auth"
import Database from "better-sqlite3"

export const auth = betterAuth({
    emailAndPassword: {
        enabled: false,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!

        }
    },
    database: new Database("./travelwall.db"),
})