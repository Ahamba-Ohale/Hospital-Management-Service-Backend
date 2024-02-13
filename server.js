require('dotenv').config()

const cors = require('cors');
const express = require('express')
const mongoose = require('mongoose')
const userRoute = require('./userRoute')
const cookieParser = require('cookie-parser');


// express App
const app = express()

app.use(cors());
app.use(cookieParser());
app.use('/api/users', userRoute)

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


// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const userRoute = require("./routes/userRoute");

// const app = express();

// // Connect to MongoDB
// mongoose.connect("mongodb+srv://richardakpan77:<password>@personal-api.pfhzedw.mongodb.net/?retryWrites=true&w=majority", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
// });

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Routes
// app.use("/api/users", userRoute);

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");

// const app = express();

// app.use(cors());

// // connect to db
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     // listen for request
//     app.listen(process.env.PORT, () => {
//       console.log("Server is connected to DB & running on port", process.env.PORT);
//     });
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// // import routes
// const searchRoute = require("./routes/searchRoute");

// // use routes
// app.use("/api", searchRoute);