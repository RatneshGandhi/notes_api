import express from 'express'
import { ensureAuthenticated } from '../middleware/auth.middleware.js'
import { createNoteschema } from '../validation/note.validation.js'
import { createNote,getNoteById,getNotesByUserId } from '../services/note.sevices.js'
import { en } from 'zod/locales'

const router = express.Router()

router.post('/',ensureAuthenticated,async (req,res)=>{
        try {
            const validatedata=await createNoteschema.safeParseAsync(req.body)
            if(validatedata.error){
                return res.status(400).json({error:validatedata.error.format()})
            }

            const {title,content}=validatedata.data

            const newNote=await createNote(title,content,req.user.id)
            return res.status(201).json({message:'Note created',id:newNote.id})
        } catch (error) {
            return res.status(400).json({error:'Something is wrong'})
        }
})

router.get('/',ensureAuthenticated,async (req,res)=>{
        try {
            const user=await getNotesByUserId(req.user.id)

            return res.status(200).json({user})
        } catch (error) {
            return res.status(400).json({error:'something is wrong'})
        }
})

router.get('/:id',ensureAuthenticated,async (req,res)=>{
    try {
        const note=await getNoteById(req.params.id,req.user.id)
        
        return res.status(200).json({note})
    } catch (error) {
        return res.status(400).json({error:'Note not foumd'})
    }
})

export default router