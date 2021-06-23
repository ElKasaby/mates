const JWT = require('jsonwebtoken')
const { json } = require('body-parser')
// const mongose = require('mongoose')
const User = require('../models/user')
const cloud = require('../../cloudinary')
const fs = require('fs')



signToken = user => {
    return JWT.sign({
        iss: 'Elkasaby',
        sub:user.id,
        jat: new Date().getTime(),// current time
        exp: new Date().setDate(new Date().getDate()+1)// current time + 1 day ahead 
    },process.env.JWT_KEY)
}

module.exports = {
    signup: async (req, res, next)=>{
        const result = await cloud.uploads(req.files[0].path||req.files[0])
        const { name, email, password, confirmPassword, bio, phone, address, track, mySkills } = req.body

        console.log("i am here");
        //check if there is a user with the same name
        const foundname = await User.findOne({"name": name})
        console.log(foundname);
        if(foundname){
           return res.status(403).json({
                error : 'name is already exist'
            })
        }

        //check if there is a user with the same email
        const foundemail = await User.findOne({"email": email})
        if(foundemail){
           return res.status(403).json({
                error : 'Email is already exist'
            })
        }

        // check if password is match
        if(password != confirmPassword){
            return res.status(409).json({
                message: 'Password do not match'
            })
        }

        // check length of password
        if(req.body.password.length < 8){
            return res.status(409).json({
                message: 'Password must be at least 9 characters'
            })
        }

        // console.log(result.url);
        // console.log(req.files[0].originalname);
        //create a new user
        const newUser = new User({
            // methods: 'local',
            // local: {
            name: name,
            email: email,
            password: password,
            bio: bio,
            phone: phone,
            address: address,
            track : track,
            mySkills: mySkills,
            // },
            image: req.files[0].originalname,
            url: result.url,
        })  
        await newUser.save()
        fs.unlinkSync(req.files[0].path)
        
        // Generate the token 
        const token = signToken(newUser)

        res.status(200).json({
            token,
            id: newUser.id,
            name: req.body.name,
            email: req.body.email,
            newUser
        })

        
    },

    signin: async (req, res, next)=>{

        const user = await User.findOne({ "email": req.body.email })

        // Generate token
        const token = signToken(req.user)
        res.status(200).json({
            token,
            id: user.id,
            name: user.name,
            email: user.email
        })
    },

    // googleOAuth: async (req, res, next)=>{
    //     const token = signToken(req.user)
    //     res.status(200).json({
    //         token
    //     })
    // },

    // facebookOAuth: async (req, res, next)=>{
    //     const token = signToken(req.user)
    //     res.status(200).json({
    //         token,
    //         message:"connect with facebook"
    //     })
    // },
    editProfile: async (req, res, next)=>{
        const profile = await User.findOne({"_id":req.user._id })
        const result = await cloud.uploads(req.files[0].path||req.files[0])
        req.body.image = req.files[0].originalname
        req.body.url = result.url
       
        // new value
        await profile.set(req.body).save()
        res.status(200).json({
            message: 'Edit Done',
            profile
        })

    },
    profile : async (req, res, next)=>{
        const profileId = req.params.id
        const profile = await User.findOne({"_id": profileId})
        console.log(profile);
        if(profile){
            return res.status(200).json({
                message: 'this is the profile',
                profile
            })
        }
        res.status(200).json({
            message: 'this profile is not found',
        })


    }
}