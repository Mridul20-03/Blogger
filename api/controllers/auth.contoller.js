import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { handleError } from "../utils/handleError.js";
import jwt from "jsonwebtoken";

//we use next to use middleware
export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(handleError(400, "All fields are required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    res.json("SignUp Successfull");
  } catch (err) {
    next(err);
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    return next(handleError(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validUser || !validPassword) {
      return next(handleError(404, "Invalid Credentials"));
    }

    //generate a JWT
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET_KEY);

    const { password: pass, ...rest } = validUser._doc;

    // add JWT to cookie named 'access_token'
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req,res,next) => {
    const { email, name , googlePhotoUrl } = req.body;

    try{
        const user = await User.findOne({email});
        if(user)
        {
          const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET_KEY);

          const { password , ...rest } =  user._doc;
          res.status(200).cookie("access_token", token, { httpOnly: true,})
          .json(rest);
        }
        else
        {
          const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
          
          const hashedPassword = bcryptjs.hashSync(generatedPassword,10);

          const newUser = new User({
            username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
            email,
            password: hashedPassword,
            profilePicture : googlePhotoUrl,
          });

          await newUser.save();

          const token = jwt.sign({ id: newUser._id },process.env.JWT_SECRET_KEY);

          const { password , ...rest } =  newUser._doc;
          res.status(200).cookie("access_token", token, { httpOnly: true,})
          .json(rest);
        }
      }
      catch(err) {
      }

};
