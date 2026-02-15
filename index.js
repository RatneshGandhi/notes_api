import express from 'express'
import 'dotenv/config'
import { authentication } from './middleware/auth.middleware.js'
import userRouter from './routes/user.routes.js'
import noteRouter from './routes/notes.routes.js'

const app=express();
const PORT=process.env.PORT ?? 8000

app.use(express.json())
app.use(authentication)
app.use('/user',userRouter)
app.use('/notes',noteRouter)


app.listen(PORT,()=>{
    console.log('Server is up aand running');
    
})