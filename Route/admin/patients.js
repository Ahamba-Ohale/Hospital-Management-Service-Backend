const express = require('express');
const {
    createPatient,
    getPatients,
    getPatient,
    deletePatient,
    updatePatient
} = require('../../controller/admin/patientController')

// Middleware to check for authentication
// const isAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) {
//       return next();
//     }
//     res.status(401).json({ error: 'Unauthorized' });
//   };

const router = express.Router()

// require auth for all Patient route

// Get all Patients
router.get('/', getPatients)

// Get a single Patient
router.get('/:id', getPatient)

// Create a new Patient
router.post('/', createPatient)

// Delete a Patient
router.delete('/:id', deletePatient)

// Update a Patient
router.patch('/:id', updatePatient)

module.exports = router