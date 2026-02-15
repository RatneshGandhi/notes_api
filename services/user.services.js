import { eq } from 'drizzle-orm'
import db from '../db/index.js'
import { usersTable } from '../models/user.models.js'

export async function getUserByEmail(email) {
    const [existingUser] = await db
        .select({
            id: usersTable.id,
            firstname: usersTable.firstname,
            lastname: usersTable.lastname,
            email: usersTable.email,
            password: usersTable.password,
            salt: usersTable.salt
        })
        .from(usersTable)
        .where(eq(usersTable.email, email))



    return existingUser
}

export async function createUser(firstname, lastname, email, hashedPassword, salt) {
    const [newUser] = await db.insert(usersTable).values({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        salt
    }).returning({ id: usersTable.id })

    return newUser;
}