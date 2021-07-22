const mongoose = require("mongoose")

const calendarSchema = mongoose.Schema(
  {   
    meetingName : {
      type: String
    },
    teamName : {
      type: String
    },
    teamId : {
      type: String
    },
    meetingTime : {
      type : String
    },
    meetingDate : {
      type : String
    },
    ownerMetting : {
      type : String
    },
    ownerId : {
      type : String
    },
    members :[
      {
        type:  mongoose.Schema.Types.ObjectId,
        ref:'User'
      },
    ],
  },{ timestamps: true }
)
 
 


module.exports = mongoose.model('calendar',calendarSchema) 