const mongoose = require("mongoose")

const calendarSchema = mongoose.Schema({   
  meetingName : {
    type: String
  },
  time : {
    type : String
  },
  date : {
    type : String
  },
  ownerMetting : {
    type : String
  },
  members :[
    {
      type:  mongoose.Schema.Types.ObjectId,
      ref:'User'
    },
  ],
})
 
 


module.exports = mongoose.model('calendar',calendarSchema) 