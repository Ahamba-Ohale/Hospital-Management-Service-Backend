// // Load environment variables
// require('dotenv').config();

// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const router = require('./routes/paymentRoute');

// // Express App for PORT1
// const app1 = express();
// app1.use(cors());
// app1.use(express.json());
// app1.use(bodyParser.json()); // Add bodyParser middleware for parsing JSON
// app1.use('/paystack-webhook', router); // Mount the router under /paystack-webhook

// // Express App for PORT
// const app2 = express();
// app2.use(cors());
// app2.use(express.json());
// app2.use(bodyParser.json()); // Add bodyParser middleware for parsing JSON
// app2.use('/paystack-webhook', router); // Mount the router under /paystack-webhook

// // Connect to the database
// mongoose.connect(process.env.MONGO_URI, {})
//   .then(() => {
//     console.log('Connected to MongoDB');

//     // Listen for requests on PORT1
//     const PORT1 = process.env.PORT1 || 3001;
//     app1.listen(PORT1, () => {
//       console.log('Server is connected to DB & running on port', PORT1);
//     });

//     // Listen for requests on PORT
//     const PORT = process.env.PORT || 4000;
//     app2.listen(PORT, () => {
//       console.log('Server is connected to DB & running on port', PORT);
//     });
//   })
//   .catch((error) => {
//     console.error('Error connecting to MongoDB:', error.message);
//   });












require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const router = require('./routes/paymentRoute');




// express App
const app = express();

app.use(cors());
app.use(express.json()); // to support JSON-encoded bodies
console.log('Middleware setup complete');
app.use(router);
console.log('router complete');

// connect to db
mongoose.connect(process.env.MONGO_URI, {
  
})
  .then(() => {
    console.log('Connected to MongoDB');

     // listen for requests on port 3000
     const PORT1 = process.env.PORT1;
     app.listen(PORT1, () => {
       console.log('Server is connected to DB & running on port', PORT1);
     });

 

    // listen for requests
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log('Server is connected to DB & running on port', PORT);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });
