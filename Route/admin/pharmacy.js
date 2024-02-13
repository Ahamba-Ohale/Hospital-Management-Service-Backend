const express = require('express');
const {
    createPharmacist,
    getPharmacists,
    getPharmacist,
    deletePharmacist,
    updatePharmacist
} = require('../../controller/admin/pharmacyController')

// Middleware to check for authentication
// const isAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) {
//       return next();
//     }
//     res.status(401).json({ error: 'Unauthorized' });
//   };

const router = express.Router()

// require auth for all Pharmacist route

// Get all Pharmacists
router.get('/', getPharmacists)

// Get a single Pharmacist
router.get('/:id', getPharmacist)

// Create a new Pharmacist
router.post('/', createPharmacist)

// Delete a Pharmacist
router.delete('/:id', deletePharmacist)

// Update a Pharmacist
router.patch('/:id', updatePharmacist)

module.exports = router