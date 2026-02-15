import { eq, and } from 'drizzle-orm';
import db from '../db/index.js'
import { notesTable, usersTable } from '../models/index.js'



export async function createNote(title,content,userId){
    const [newNote]=await db.insert(notesTable).values({
        title,
        content,
        userId
    }).returning({
        id:notesTable.id,
        title:notesTable.title,
        content:notesTable.content,
        createdAt:notesTable.createdAt
    })

    return newNote;
}

export async function getNotesByUserId(userId){
    const [existingNote]=await db.select({
        id:notesTable.id,
        title:notesTable.title,
        content:notesTable.content,
        createdAt:notesTable.createdAt,
        updatedAt:notesTable.updatedAt
    }).from(notesTable)
    .where(eq(notesTable.userId,userId))

    return existingNote;
}

export async function getNoteById(noteId,userId){
    const [noteById]=await db.select()
    .from(notesTable)
    .where(and(
        eq(notesTable.id,noteId),
        eq(notesTable.userId,userId))
    )
    return noteById
}