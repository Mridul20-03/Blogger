import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId: {
        type : String,
        required: true,
    },
    title : {
        type : String,
        required: true,
        unique : true,
    },
    content: {
        type : String,
        required: true,
    },
    image : {
        type : String,
        default: "https://thersilentboy.com/wp-content/uploads/2022/09/Blogging.jpeg", 
    },
    category : {
       type: String,
       default: "uncategorized",
    },
    slug : {
        type: String,
        required: true,
        unique : true,
    },  
}, { timestamps: true});

const Post = mongoose.model('Post', postSchema);

export default Post;