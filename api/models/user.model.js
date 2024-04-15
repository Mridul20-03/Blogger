import mongoose from 'mongoose';

// rules for our users 
const userSchema = new mongoose.Schema({
    username:{
        type : String,
        required : true,
        unique : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password: {
        type : String,
        required : true,
    },
    profilePicture:{
        type: String,
        default: "https://play-lh.googleusercontent.com/C9CAt9tZr8SSi4zKCxhQc9v4I6AOTqRmnLchsu1wVDQL0gsQ3fmbCVgQmOVM1zPru8UH=w240-h480-rw"
    },
    isAdmin : {
        type : Boolean,
        default: false,
    },
    
    }, { timestamps : true}
);

//Create User Model:
const User = mongoose.model('User', userSchema);

export default User;
