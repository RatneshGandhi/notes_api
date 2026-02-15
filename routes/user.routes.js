import express from 'express'
import { loginSchema, signUpSchema } from '../validation/user.validation.js'
import { getUserByEmail, createUser } from '../services/user.services.js'
import { hashedPasswordWithSalt } from '../utils/hash.js'
import { createToken } from '../utils/token.js'

const router = express.Router()

router.post('/signup', async function (req, res) {
    const validatedata = await signUpSchema.safeParseAsync(req.body)
    if (validatedata.error) {
        return res.status(400).json({ error: validatedata.error.format() })
    }

    const { firstname, lastname, email, password } = validatedata.data

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
        return res.status(409).json({ message: 'User already exists' })
    }

    const { salt, password: hashedPassword } = hashedPasswordWithSalt(password)
    const newUser = await createUser(firstname, lastname, email, hashedPassword, salt)

    return res.status(201).json({ message: 'User created', userId: newUser.id })
})

router.post('/login', async function (req, res) {
    try {
        const validatedata = await loginSchema.safeParseAsync(req.body)
        if (validatedata.error) {
            return res.status(400).json({ message: 'something is wrong' })
        }

        const { email, password } = validatedata.data

        const user = await getUserByEmail(email)
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        const { password: hashedPassword } = hashedPasswordWithSalt(password, user.salt)
        if (user.password !== hashedPassword) {
            return res.status(401).json({ message: 'Invalid email or password1' })
        }

        const token = await createToken({ id: user.id })
        return res.status(200).json({ message: token })
    } catch (error) {
        return res.status(400).json({ error: 'Something is wrong' })
    }
})

export default router;