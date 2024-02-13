require('dotenv').config()

const cors = require('cors');
const express = require('express')
const mongoose = require('mongoose')
const router = require("./routes/userRoute")
const cookieParser = require('cookie-parser');


// express App
const app = express()

app.use(cors());
app.use(cookieParser());
app.use('/api/users', router)

//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for request
        app.listen(process.env.PORT, () => {
            console.log("Server is connected to DB & running on port", process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })