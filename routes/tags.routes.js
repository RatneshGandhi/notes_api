import express from 'express'
import { ensureAuthenticated } from '../middleware/auth.middleware.js'
import { addTagsSchema } from '../validation/tag.validation.js'
import { getNoteById } from '../services/note.sevices.js'
import { findOrCreateTag, addTagNote, removeTagFromNote, getTagByUserId, getTagsForNote } from '../services/tag.services.js'

const router = express.Router()

router.post('/:id/tags', ensureAuthenticated, async (req, res) => {
  try {
    const validateData = await addTagsSchema.safeParseAsync(req.body)
    if (validateData.error) {
      return res.status(400).json({ error: validateData.error.format() })
    }


    const verify = await getNoteById(req.params.id, req.user.id)
    if (!verify) {
      return res.status(404).json({ error: 'Not found' })
    }

    const addedTags = []
    for (const tagName of validateData.data.tags) {
      const createTag = await findOrCreateTag(tagName, req.user.id)
      await addTagNote(req.params.id, createTag.id)
      addedTags.push(createTag)

    }
    return res.status(201).json({ Tags: addedTags })
  } catch (error) {
    return res.status(400).json({ error: 'Something is wrong' })
  }
})

router.delete('/:id/tags/:tagId', ensureAuthenticated, async (req, res) => {
  try {
    const verify = await getNoteById(req.params.id, req.user.id)
    if (!verify) {
      return res.status(404).json({ error: 'Not found' })
    }

    const removeTag = await removeTagFromNote(req.params.id, req.params.tagId)
    if (!removeTag) {
      return res.status(404).json({ error: 'Tag not linked to note' })
    }

    return res.status(200).json({ message: 'Tag removed from note' })
  } catch (error) {
    return res.status(400).json({ message: 'Something is wrong' })
  }
})

router.get('/:id/tags', ensureAuthenticated, async (req, res) => {
  try {
    const verify = await getNoteById(req.params.id, req.user.id)
    if (!verify) {
      return res.status(404).json({ error: 'Not found' })
    }

    const tags = await getTagsForNote(req.params.id)
    return res.status(200).json({ tags })
  } catch (error) {
    return res.status(400).json({ error: 'something is wrong' })
  }
})

export default router;