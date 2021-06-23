const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  image: {
    type:String
  },
  url: {
    type: String,
  },
  bio:{
    type: String,
  },
  phone:{
    type: String,
  },
  address:{
    type: String,
  },
  track:{
    type: String,
  },
  mySkills:{
    type: String,
  },
  // methods: {
  //   type: String,
  //   enum: ['local', 'google', 'facebook']
  // },
  // local: {
  //   name: {
  //     type: String,
  //     require: true
  //   },
  //   email: {
  //     type: String,
  //     require: true
  //   },
  //   password: {
  //     type: String,
  //     require: true
  //   },
  //   image: {
  //     type:String
  //   },
  //   bio:{
  //     type: String,
  //   },
  //   phone:{
  //     type: String,
  //   },
  //   address:{
  //     type: String,
  //   },
  //   track:{
  //     type: String,
  //   },
  //   mySkills:{
  //     type: String,
  //   }
  // },
  // google: {
  //   name: {
  //     type: String
  //   },
  //   id: {
  //     type: String
  //   },
  //   email: {
  //     type: String
  //   },
  //   image: {
  //     type:String
  //   },
  //   bio:{
  //     type: String,
  //   },
  //   phone:{
  //     type: String,
  //   },
  //   address:{
  //     type: String,
  //   },
  //   track:{
  //     type: String,
  //   },
  //   mySkills:{
  //     type: String,
  //   }
  // },
  // facebook: {
  //   name: {
  //     type: String
  //   },
  //   id: {
  //     type: String
  //   },
  //   email: {
  //     type: String
  //   },
  //   image: {
  //     type:String
  //   },
  //   bio:{
  //     type: String,
  //   },
  //   phone:{
  //     type: String,
  //   },
  //   address:{
  //     type: String,
  //   },
  //   track:{
  //     type: String,
  //   },
  //   mySkills:{
  //     type: String,
  //   }
  // }
})

userSchema.pre('save', async function (next) {
    try {
      // if(this.methods !== 'local'){
      //   next()
      // }
      // Generate a salt
      const salt = await bcrypt.genSalt(10);
      // Generate a password hash (salt + hash)
      const passwordHash = await bcrypt.hash(this.password, salt);
      // Re-assign hashed version over original, plain text password
      this.password = passwordHash;
      next();
    } catch (error) {
      next(error);
    }
  });

userSchema.methods.isValidPassword = async function (newPassword) {
    try {
      return await bcrypt.compare(newPassword, this.password);
    } catch (error) {
      throw new Error(error);
    }
  }
 


module.exports = mongoose.model('User',userSchema) 