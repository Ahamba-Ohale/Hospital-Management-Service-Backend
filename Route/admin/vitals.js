const express = require('express');
const {
    createVital,
    getVitals, 
    getVitalById,  
    updateVital, 
    deleteVital
} = require('../../controller/admin/vitalController');

const router = express.Router()

// Create a new Vital
router.post('/', createVital)

// Get all Vitals
router.get('/', getVitals)

// Get a single vital 
router.get('/:id', getVitalById)

// Update a vital
router.patch('/:id', updateVital)

// Delete a vital
router.delete('/:id', deleteVital)

module.exports = router