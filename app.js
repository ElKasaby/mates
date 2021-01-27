const express = require('express')
const morgan = require('morgan')
const bodyParser =require('body-parser')
const { log } = require('console')
const mongoose = require('mongoose')

const app = express() 

// Conected to mongoose
mongoose.Promise = global.Promise
mongoose.connect('mongodb+srv://Kasaby:'+ 
    process.env.MONGO_ATLAS_PW +
    '@cluster0.ylbq6.mongodb.net/Auth?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(console.log("mongose conected")) 


//Middlewarees
app.use(morgan('dev'))
app.use(bodyParser.json())

//Routes
app.use('/user',require('./api/routes/user'))

//start the server
const port = process.env.PORT || 3000
app.listen(port)
console.log(`server listening at ${port}`);