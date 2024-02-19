const express = require('express');
const {
    createAppointment,
    getAppointments,
} = require('../controller/appointmentController');

const router = express.Router()

// require auth for all Appointment route

// Get all Appointments
router.get('/', getAppointments);

// Create a new Appointment
router.post(
    '/',  
    // passport.authenticate("jwt",{session:false}), 
    createAppointment
);

module.exports = router