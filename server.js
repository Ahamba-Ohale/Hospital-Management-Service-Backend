require('dotenv').config()

const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose')
const doctorRoutes = require('./Route/doctors')

// express App
const app = express()

app.use(express.json());
app.use(cors());

// routes
app.use('/api/doctors', doctorRoutes)


//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for request
        app.listen(process.env.PORT || 5000, () => {
            console.log("Server is connected to DB & running on port", process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })
