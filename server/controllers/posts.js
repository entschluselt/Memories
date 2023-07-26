import mongoose from 'mongoose';
import express from 'express';
import PostMessage from "../models/postMessage.js";

const router = express.Router();

export const getPost = async (req, res) => { 
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
}

export const getPosts = async (req, res) => {
    const { page } = req.query;
    
    try {
        const LIMIT = 8; // number of posts per page
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    
        const total = await PostMessage.countDocuments({});
        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

// QUERY -> /posts?page=1 means page = 1 (usually used when we want to query some data like search)
// PARAMS -> /posts/123 means id = 123 (usually used when we want some specific resource)
export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        // we convert the query in regular exp because its easier to search in the database for mongoDB and mongoose
        const title = new RegExp(searchQuery, 'i') //'i' is used for ignoring the style like (like, LIKE, Like) all are equal to like

        const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') }}] }) // find me the posts that match either the title
        // or any of the tags that are in the array of the tags 
        
        res.json({ data: posts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    const post = req.body;    // here we are requesting the body from the client side
    
    const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });

    try {
        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id } = req.params;
    // now we need to request it from the client side to get the id first and then the post so first we need to keep track of 
    // the current id in app.js of client because we have to share that current state of Id b/w the post and the form
    // and app.js is the only parent component i.e, parent to both posts and form and later on we will do it using redux
    const { title, message, creator, selectedFile, tags } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id))   return res.status(404).send('No post with that id');

    await PostMessage.findByIdAndRemove(id);

    res.json({ message : 'Post deleted successfully'})
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    // first we check if the user is authenticated we can do this directly by req.userId since it must be populated before
    if(!req.userId) return res.json({ message: "Unauthenticated" });

    if(!mongoose.Types.ObjectId.isValid(id))   return res.status(404).send('No post with that id');

    const post = await PostMessage.findById(id);

    // then we check if the userId is already in the like post section
    const index = post.likes.findIndex((id) => id === String(req.userId));

    if(index === -1){
        post.likes.push(req.userId);
    }
    else{
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new : true });

    res.json(updatedPost);
}

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    // fetching the post that we have put our comment on
    const post = await PostMessage.findById(id); // getting the post from the database

    post.comments.push(value); // adding the comment to the post

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new : true }); // updating the database so that the new post contains that new comment 

    res.json(updatedPost); // we recieve this on the frontend
}

export default router;