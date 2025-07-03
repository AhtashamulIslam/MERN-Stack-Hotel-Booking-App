import jwt from 'jsonwebtoken'
import {errorHandler} from './error.js'

export const verifyToken = async (req,res,next)=>{
        const token = req.cookies.access_token // We take the requested user token
    if(!token){
        return next(errorHandler(401,'Unauthorized'))
    }
    //Verify the user token with our token via cookie parser.
    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,user)=>{
        if(err){
            return next(errorHandler(401,'Unauthorized'))
        }
        req.user=user // If the token is matched , we attatch the user in request body.
        next() // It will allow the executipon to the next function.
    })
}

