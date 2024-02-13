require('dotenv').config()

const express = require('express');
// const cors = require('cors');
const mongoose = require('mongoose');
const articleRoute = require('./routes/articleRoutes');

// express App
const app = express()

// app.use(cors());
app.use(express.json());

app.use('/api/articleRoutes', articleRoute)


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
