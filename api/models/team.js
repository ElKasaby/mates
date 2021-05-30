const mongoose = require("mongoose")

const teamSchema = mongoose.Schema({
    teamName:{
        type: String,
        require: true
    },
    teamDescription:{
        type: String,
        require: true
    },
    teamPhoto:{
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    },
    teamOwner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    teamMember:[{
        type:  mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    teamAdmin:[{
        type:  mongoose.Schema.Types.ObjectId,
        ref:'user'
    }]
})
 
 


module.exports = mongoose.model('team',teamSchema) 