import { z } from 'zod'

export const addTagsSchema=z.object({
    tags:z.array(
        z.string()
        .min(1)
        .max(100)
    ).min(1)
})