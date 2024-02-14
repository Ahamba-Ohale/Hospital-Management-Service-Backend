const express = require('express');
const {
    createNurse,
    getNurses,
    getNurse,
    deleteNurse,
    updateNurse
} = require('../../controller/admin/nurseController')

// Middleware to check for authentication
// const isAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) {
//       return next();
//     }
//     res.status(401).json({ error: 'Unauthorized' });
//   };

const router = express.Router()

// require auth for all Nurse route

// Get all Nurses
router.get('/', getNurses)

// Get a single Nurse
router.get('/:id', getNurse)

// Create a new Nurse
router.post('/', createNurse)

// Delete a Nurse
router.delete('/:id', deleteNurse)

// Update a Nurse
router.patch('/:id', updateNurse)

module.exports = router