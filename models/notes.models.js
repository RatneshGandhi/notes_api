import { pgTable,varchar,uuid,text,timestamp } from 'drizzle-orm/pg-core'
import { usersTable } from  './user.models.js'

export const notesTable=pgTable('notes',{
    id:uuid().primaryKey().defaultRandom(),

    title:varchar('title',{length:255}).notNull(),
    content:text('content').notNull(),

    userId:uuid('user_id').references(()=>usersTable.id).notNull(),

     createdAt:timestamp('created_at').defaultNow().notNull(),
    updatedAt:timestamp('updated_at').$onUpdate(()=> new Date()),
})