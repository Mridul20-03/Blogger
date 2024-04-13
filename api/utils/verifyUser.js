import jwt from "jsonwebtoken";
import { handleError } from "./handleError.js";

export const verifyToken = (req,res,next) => {
    const token = req.cookies.access_token;
    if(!token){
        return next(handleError(401,'Unauthorized'));
    }

    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,user) => {
        if(err){
            return next(handleError(401,'Unauthorized'));
        }
        req.user = user;
        next(); 
    });
};