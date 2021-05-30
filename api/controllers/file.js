const { json } = require('body-parser')
const mongoose = require('mongoose');
const User = require('../models/user')
const Team = require('../models/team')
const Post = require('../models/post')
const imageModel = require('../models/file')
const multerConfig = require('../../multer')
const cloud = require('../../cloudinary')
const { replaceOne } = require('../models/user')
const fs = require('fs')




module.exports ={
    allFile: async(req, res, next)=>{
        const upload = await FileUpload.find()
        res.json(upload)
    },
    upload: async(req, res, next)=>{
        const result = await cloud.uploads(req.files[0].path||req.files[0])

        const imageDetails = {
            team : req.params.teamID,
            imageName : req.files[0].originalname ,
            url : result.url
        }
        const image = new imageModel(imageDetails)
        image.save()

        // delete image local
        fs.unlinkSync(req.files[0].path)

        res.json({
            msg : "DONE",
            image: image
        })
    },
    deleteFile: async(req, res, next)=>{
 
    }
}