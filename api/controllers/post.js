const { json } = require('body-parser')
const mongoose = require('mongoose');
const User = require('../models/user')
const Team = require('../models/team')
const Post = require('../models/post')
const post = require('../models/post')
const { replaceOne } = require('../models/user')



module.exports ={
    allPosts: async(req, res, next)=>{
        const teamId = req.params.teamId
        const post = await Post.find({"team":teamId})
        
        if(post){
            return res.status(200).json({
                massage: "All posts",
                post
            })
        }
        res.status(401).json({
            massage: "No post yet",
        })
    },
    addPost: async(req, res, next)=>{
        //create a new post
        const newPost = new Post({
            team: req.params.teamId,
            body: req.body.postBody,
            postOwner: req.user.id
        })
        await newPost.save()
        res.status(201).json(newPost)

    },
    deletePost: async(req, res, next)=>{
        const postId = req.params.postId
        const post = await Post.findById(postId)
        if(post){
            if(post.postOwner == req.user.id){
                await Post.deleteOne({"_id": postId})
                return res.status(200).json({
                    massage: "post Deleted",
                })
            }
            res.status(401).json({
                massage: "Error this is not your post",
            })
        }
        res.status(401).json({
            massage: "Error this post does not exist",
        })
        
    },
    allReply: async(req, res, next)=>{
        const postId = req.params.postId
        const post = await Post.findById(postId)
        const replys = post.comments
        if(post){
            return res.status(200).json({
                replys
            })
        }
        res.status(401).json({
            massage: "Error this post does not exist",
        })
    },
    addReply: async(req, res, next)=>{
        const postId = req.params.postId
        const post = await Post.findById(postId)

        //create new comment
        const newComment = {
            commentBody: req.body.commentBody,
            commentUser: req.user.id
        }

        post.comments.unshift(newComment)
        await post.save()
        res.status(201).json({
           massage  : 'Reply add sucsusfly',
           post
        })

    },
    
    deleteReply: async(req, res, next)=>{
        const postId = req.params.postId
        const replyId = req.params.replyId
        const post = await Post.findById(postId)
        
        const comment =post.comments

        for(var i= 0; i <comment.length ; i++){
            if(comment[i].id == replyId){
                comment.splice(i,1)  
                await post.save()
                return res.status(200).json({
                    massage: "Reply Deleted",
                    comment
                })            
            }
        }
        res.status(401).json({
            massage: "Reply does not exist",
            comment
        })
    },

}