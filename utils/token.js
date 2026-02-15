import jwt from 'jsonwebtoken'
import { userTokenSchema } from '../validation/token.validation.js'
const JWT_SECRET = process.env.JWT_SECRET

export async function createToken(payload) {
    const validationResult = await userTokenSchema.safeParseAsync(payload)
    if (validationResult.error) {
        throw new Error(validationResult.error.message)
    }

    const validatedResult = validationResult.data

    const token = jwt.sign(validatedResult, JWT_SECRET)
    return token;
}

export function verifyToken(token) {
    try {
        const payload = jwt.verify(token, JWT_SECRET)
        return payload
    } catch (error) {
        return null;
    }
}