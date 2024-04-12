import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { hanleError } from '../utils/handleError.js';
import jwt from 'jsonwebtoken';


//we use next to use middleware
export const signUp = async (req,res,next) => {
    const { username , email , password } = req.body;

    if(!username || !email || !password || username === '' || email === '' || password === ''){
        return next(hanleError(400,'All fields are required'));
    }

    const hashedPassword = bcryptjs.hashSync(password,10);

    const newUser = new User({
        username,email,password:hashedPassword
    });
    try{
        await newUser.save();
    res.json('SignUp Successfull');
    } catch(err){
        next(err);
    }
}

export const signIn = async (req,res,next) => {

    const { email , password } = req.body;
    if(!email || !password  || email === '' || password === ''){
        return next(hanleError(400,'All fields are required'));
    }

    try{

        const validUser = await User.findOne({email});

        const validPassword = bcryptjs.compareSync(password, validUser.password);



        if(!validUser || !validPassword){
            return next(hanleError(404,'Invalid Credentials'));
        }

        //generate a JWT
        const token = jwt.sign(
            { id: validUser._id },
            process.env.JWT_SECRET_KEY);

        const { password : pass, ...rest } = validUser._doc; 


    // add JWT to cookie named 'access_token'
        res.status(200).cookie('access_token',token,{
            httpOnly: true
        }).json(rest);

    }catch(error){
        next(error);
    }



}