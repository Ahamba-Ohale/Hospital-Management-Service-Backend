const express = require('express');
const {
    createDoctor,
    getDoctors,
    getDoctor,
    deleteDoctor,
    updateDoctor
} = require('../../controller/admin/DoctorController')

// Middleware to check for authentication
// const isAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) {
//       return next();
//     }
//     res.status(401).json({ error: 'Unauthorized' });
//   };

const router = express.Router()

// require auth for all Doctor route

// Get all Doctors
router.get('/', getDoctors)

// Get a single Doctor
router.get('/:id', getDoctor)

// Create a new Doctor
router.post('/', createDoctor)

// Delete a Doctor
router.delete('/:id', deleteDoctor)

// Update a Doctor
router.patch('/:id', updateDoctor)

module.exports = router