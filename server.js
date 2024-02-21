require('dotenv').config();

const doctorRoutes = require('./Route/admin/doctors')
const departmentRoutes = require('./route/admin/departments')
const patientRoutes = require('./route/admin/patients')
const nurseRoutes = require('./route/admin/nurses')
const pharmacyRoutes = require('./route/admin/pharmacy')
const appointmentRoutes = require('./Route/appointment')
const medicalHistoryRoutes = require('./Route/admin/medicalHistory')
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


// express App
const app = express();

app.use(express.json());

app.use(cors());

// middleware
app.use(express.json()) // parse incoming requests with JSON payloads and return responses in JSON format</s>
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})


// routes
app.use('/api/doctors', doctorRoutes)
app.use('/api/departments', departmentRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/nurses', nurseRoutes)
app.use('/api/pharmacy', pharmacyRoutes)
app.use('/api/appointment', appointmentRoutes)
app.use('/api/medicalHistory', medicalHistoryRoutes)

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