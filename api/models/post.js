const mongoose = require("mongoose")

const postSchema = mongoose.Schema({
  team:{
    type:  mongoose.Schema.Types.ObjectId,
    ref:'team'
  },
  body:{
    type: String,
    required: true
  },
  comments: [{
    commentBody: {
      type: String,
    },
    commentDate:{
      type: Date,
      default: Date.now
    },
    commentUser:{
      type:  mongoose.Schema.Types.ObjectId,
      ref:'user'
    }
  }],
  postOwner:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
  date:{
    type: Date,
    default: Date.now
  }
})
 
 


module.exports = mongoose.model('post',postSchema) 