import { eq, and, desc, sql, ilike, or } from 'drizzle-orm';
import db from '../db/index.js'
import { notesTable } from '../models/index.js'



export async function createNote(title, content, userId) {
    const [newNote] = await db.insert(notesTable).values({
        title,
        content,
        userId
    }).returning({
        id: notesTable.id,
        title: notesTable.title,
        content: notesTable.content,
        createdAt: notesTable.createdAt
    })

    return newNote;
}

export async function getNotes(userId, { page = 1, limit = 10, query = '' } = {}) {
    const offset = (page - 1) * limit

    let whereCondition
    if (query) {
        whereCondition = and(
            eq(notesTable.userId, userId),
            or(
                ilike(notesTable.title, `%${query}%`),
                ilike(notesTable.content, `%${query}%`)
            )
        )
    } else {
        whereCondition = eq(notesTable.userId, userId)
    }

    const notes = await db.select({
        id: notesTable.id,
        title: notesTable.title,
        content: notesTable.content,
        createdAt: notesTable.createdAt,
        updatedAt: notesTable.updatedAt
    })
        .from(notesTable)
        .where(whereCondition)
        .orderBy(desc(notesTable.createdAt))
        .limit(limit)
        .offset(offset)

    const [{ count }] = await db.select({
        count: sql`count(*)`.mapWith(Number)
    })
        .from(notesTable)
        .where(whereCondition)

    return {
        notes,
        pagination: {
            page,
            limit,
            total: count,
            totalPages: Math.ceil(count / limit)
        }
    }
}

export async function getNoteById(noteId, userId) {
    const [noteById] = await db.select()
        .from(notesTable)
        .where(and(
            eq(notesTable.id, noteId),
            eq(notesTable.userId, userId))
        )
    return noteById
}

export async function updateNote(noteId, userId, data) {

    const [updatedNote] = await db.update(notesTable)
        .set(data)
        .where(and(eq(notesTable.userId, userId), eq(notesTable.id, noteId)))
        .returning({
            id: notesTable.id,
            title: notesTable.title,
            content: notesTable.content,
            updatedAt: notesTable.updatedAt
        })
    return updatedNote
}

export async function deleteNote(noteId, userId) {
    const [deleteNote] = await db
        .delete(notesTable)
        .where(and(eq(notesTable.userId, userId), eq(notesTable.id, noteId)))
        .returning({ id: notesTable.id })

    return deleteNote
}

