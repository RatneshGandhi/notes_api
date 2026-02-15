import {z} from  'zod'

export const signUpSchema=z.object({
    firstname:z.string().min(1),
    lastname:z.string().optional(),
    email:z.string().email(),
    password:z.string().min(6).max(100)
})

export const loginSchema=z.object({
    email:z.string().email(),
    password:z.string().min(6).max(100)
})