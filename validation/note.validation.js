import { z } from 'zod'

export const createNoteschema=z.object({
    title:z.string().min(1).max(255),
    content:z.string().min(1)
})

export const updateNoteSchema=z.object({
    title:z.string().min(1).max(255).optional(),
    content:z.string().min(1).optional()
})