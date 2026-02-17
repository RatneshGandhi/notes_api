import express from 'express'
import 'dotenv/config'
import { authentication } from './middleware/auth.middleware.js'
import userRouter from './routes/user.routes.js'
import noteRouter from './routes/notes.routes.js'
import tagsRouter from './routes/tags.routes.js'
import { getTagByUserId } from './services/tag.services.js'
import { ensureAuthenticated } from './middleware/auth.middleware.js'

const app=express();
const PORT=process.env.PORT ?? 8000

app.use(express.json())
app.use(authentication)
app.use('/user',userRouter)
app.use('/notes',noteRouter)
app.use('/notes',tagsRouter)

app.get('/tags',ensureAuthenticated,async (req,res)=>{
    try {
         const tags=await getTagByUserId(req.user.id)
        return res.status(200).json({tags})
    } catch (error) {
        return res.status(400).json({error:'Something is wrong'})
    }
       
})

app.use((err, req, res, next) => {
  console.error(err);
  return res.status(500).json({ error: "Something went wrong" });
});

app.listen(PORT,()=>{
    console.log('Server is up aand running');
    
})