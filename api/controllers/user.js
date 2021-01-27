const JWT = require('jsonwebtoken')
const { json } = require('body-parser')
// const mongose = require('mongoose')
const User = require('../models/user')


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
        const { name, email, password, confirmPassword } = req.body


        //check if there is a user with the same email
        const foundUser = await User.findOne({"local.email": email})
        if(foundUser){
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


        //create a new user
        const newUser = new User({
            methods: 'local',
            local: {
            name: name,
            email: email,
            password: password,
            }
        })  
        await newUser.save()

        // Generate the token 
        const token = signToken(newUser)

        res.status(200).json({
            token,
            message: 'done'
        })

        
    },

    signin: async (req, res, next)=>{
        // Generate token
        const token = signToken(req.user)
        res.status(200).json({
            message: "done login",
            token
        })
    },

    googleOAuth: async (req, res, next)=>{
        const token = signToken(req.user)
        res.status(200).json({
            token
        })
    },

    facebookOAuth: async (req, res, next)=>{
        const token = signToken(req.user)
        res.status(200).json({
            token,
            message:"connect with facebook"
        })
    },

    secret: async (req, res, next)=>{
        res.status(200).json({
            message: 'You now can acsses the private information'
        })
    }
}