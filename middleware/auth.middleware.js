import { verifyToken } from '../utils/token.js'

export function authentication(req,res,next){
    const authHeader=req.header('authorization')

    if(!authHeader) return next();

    if(!authHeader.startsWith('Bearer')){
        return null;
    }

    const [_,token]=authHeader.split(" ")

    const payload=verifyToken(token)

    req.user=payload
    next();
}

export function ensureAuthenticated(req,res,next){
    if(!req.user || !req.user.id){
        return res.status(401).json({message:'Not authenticated'})
    }
    next();
}