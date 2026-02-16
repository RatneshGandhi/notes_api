import db from '../db/index.js'
import { tagsTable,noteTagsTable } from '../models/index.js'
import { eq,and } from 'drizzle-orm'

export async function findOrCreateTag(name,userId){
        const [existingUser]=await db
        .select({
            id:tagsTable.id,
            name:tagsTable.name
        })
        .from(tagsTable)
        .where(and(eq(tagsTable.name,name),eq(tagsTable.userId,userId)))

        if(existingUser){
            return existingUser
        }

        const [newTag]=await db.insert(tagsTable).values({
            id,
            name
        }).returning({
            id:tagsTable.id,
            name:tagsTable.name
        })
        return newTag
}

export async function addTagNote(noteId,tagId){
    const [existingNoteTag]=await db
    .select()
    .from(noteTagsTable)
    .where(and(eq(noteTagsTable.tagId,tagId),eq(noteTagsTable.noteId,noteId)))

    if(existingNoteTag){
        return existingNoteTag
    }
    
    const [newNoteTag]=await db.insert(noteTagsTable).values({
        noteId,
        tagId
    }).returning({
        id:noteTagsTable.id,
        noteId:noteTagsTable.noteId,
        tagId:noteTagsTable.tagId
    })

    return newNoteTag

}

export async function removeTagFromNote(noteId,tagId){
    const [deleteTag]=await db
    .delete(noteTagsTable)
    .where(and(eq(noteTagsTable.noteId,noteId),eq(noteTagsTable.tagId,tagId)))
    .returning({
        id:noteTagsTable.id
    })

    return deleteTag
}

export async function getTagByUserId(userId){
    const [tagByUserId]=await db.select({
        id:tagsTable.id,
        name:tagsTable.name
    }).from(tagsTable).where(eq(tagsTable.userId.userId))

    return tagByUserId
}

export async function getTagsForNote(noteId) {
    const tags = await db
        .select({
            id: tagsTable.id,
            name: tagsTable.name
        })
        .from(tagsTable)
        .innerJoin(
            noteTagsTable,
            eq(tagsTable.id, noteTagsTable.tagId)
        )
        .where(eq(noteTagsTable.noteId, noteId))

    return tags
}