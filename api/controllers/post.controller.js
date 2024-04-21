import { handleError } from "../utils/handleError.js";
import Post from "../models/post.model.js";

export const createPost = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(handleError(403, "You are not allowed to create a post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(handleError(400, "Please provide all required fields"));
  }
  // For SEO purpose using Slug instead of just post
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    next(err);
  }
};

 /*User can search between content and title , so for this we use $or which use regex and option means lowercase and uppercase is not imp */

 // we need startindex to know which post we are fetching
  //also if user clicks showmore then we fetch more
  
 export const getPosts = async(req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const deletepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this post'));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json('The post has been deleted');
  } catch (error) {
    next(error);
  }

};


export const deletePost = async (req, res,next) => {
      if(!req.user.isAdmin || req.user.id !== req.params.userId){
          return next(handleError(403,'You do not have permission to delete this post.'));
      }
      try{
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json('Post has been  deleted successfully');

      }catch(err) {
          next(err);
      }
};


export const updatePost = async (req, res, next) => {
  if(!req.user.isAdmin || req.user.id !== req.params.userId){
    return next(handleError(403,'You are not authorized to edit the post.'));
  }

  try{
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.postId,
        {
          $set : {
            title : req.body.title,
            content : req.body.content,
            category : req.body.category,
            image: req.body.image,
          },
        }, 
        { new : true}
      );
      res.status(200).json(updatedPost);
  }
  catch(err){
    next(err);
  }
};