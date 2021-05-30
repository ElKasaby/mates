const mongoose = require('mongoose')

const imageUpload = mongoose.Schema({
    team:{
        type:  mongoose.Schema.Types.ObjectId,
        ref:'team'
    },
    imageName : {
        type : String,
        required : true
    },
    url : {
        type: String,
        required : true
    }
})

module.exports = mongoose.model('imageUpload',imageUpload)
