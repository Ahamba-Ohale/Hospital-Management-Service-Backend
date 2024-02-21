const express = require('express');
const {
    createMedicalHistory,
    getAllMedicalHistory,
    getMedicalHistoryById,
    updateMedicalHistory,
    deleteMedicalHistory
} = require('../../controller/admin/medicalHistoryController')

// Middleware to check for authentication
// const isAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) {
//       return next();
//     }
//     res.status(401).json({ error: 'Unauthorized' });
//   };

const router = express.Router()

// require auth for all Doctor route

// Get all MedicalHistory
router.get('/', getAllMedicalHistory)

// Get a single MedicalHistory
router.get('/:id', getMedicalHistoryById)

// Create a new MedicalHistory
router.post('/', createMedicalHistory)

// Delete a MedicalHistory
router.delete('/:id', deleteMedicalHistory)

// Update a MedicalHistory
router.patch('/:id', updateMedicalHistory)

module.exports = router