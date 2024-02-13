require('dotenv').config();

const articleRoute = require('./routes/articleRoutes');
const doctorRoutes = require('./route/admin/doctors')
const departmentRoutes = require('./route/admin/departments')
const patientRoutes = require('./route/admin/patients')
const nurseRoutes = require('./route/admin/nurses')
const pharmacyRoutes = require('./route/admin/pharmacy')
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const router = require('./routes/paymentRoute');
const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);

// express App
const app = express();

app.use(express.json());

app.use(cors());
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(router);

// middleware
app.use(express.json()) // parse incoming requests with JSON payloads and return responses in JSON format</s>
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/articleRoutes', articleRoute)
app.use('/api/doctors', doctorRoutes)
app.use('/api/departments', departmentRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/nurses', nurseRoutes)
app.use('/api/pharmacy', pharmacyRoutes)

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