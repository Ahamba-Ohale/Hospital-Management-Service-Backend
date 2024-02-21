require('dotenv').config();

const cookieParser = require('cookie-parser');

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const router = require('./routes/paymentRoute');



const bodyParser = require('body-parser')
// const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);
const userRoutes = require('./routes/userRoute');



// express App
const app = express();

app.use(express.json());

app.use(cors());

app.use(express.json()); // to support JSON-encoded bodies
console.log('Middleware setup complete');
app.use(router);
console.log('router complete');


// middleware
app.use(express.json()) // parse incoming requests with JSON payloads and return responses in JSON format</s>
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})



app.use('/api/', userRoutes);

//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
     console.log('Connected to MongoDB');

     // listen for requests on port 3000
     const PORT1 = process.env.PORT1;
     app.listen(PORT1, () => {
       console.log('Server is connected to DB & running on port', PORT1);
     });
  
  
        // listen for request
        app.listen(process.env.PORT || 5000, () => {
            console.log("Server is connected to DB & running on port", process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })