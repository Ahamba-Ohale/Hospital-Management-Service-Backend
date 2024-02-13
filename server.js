require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const router = require('./routes/paymentRoute');
const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);


// express App
const app = express();

app.use(cors());
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(router);

// connect to db
mongoose.connect(process.env.MONGO_URI, {
  
})
  .then(() => {
    console.log('Connected to MongoDB');

    // listen for requests
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log('Server is connected to DB & running on port', PORT);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });
