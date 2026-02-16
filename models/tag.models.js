import { pgTable,varchar,text,uuid,timestamp } from 'drizzle-orm/pg-core'
import { usersTable } from './user.models.js'
import { notesTable } from './notes.models.js'

export const tagsTable=pgTable('tagsTable',{
    id:uuid('id').primaryKey().defaultRandom(),
    name:varchar('name',{length:100}).notNull(),
    userId:uuid('userId').references(()=>usersTable.id),
    createdAt:timestamp('created_at').defaultNow().notNull(),
})

export const noteTagsTable=pgTable('notesTagTable',{
    id:uuid().primaryKey().defaultRandom(),
    noteId:uuid('note_id').references(()=>notesTable.id,{onDelete:'cascade'}),
    tagId:uuid('tag_id').references(()=>tagsTable.id,{onDelete:'cascade'})
})