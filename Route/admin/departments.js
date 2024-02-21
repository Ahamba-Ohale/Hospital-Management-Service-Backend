const express = require('express');
const {
    createDepartment,
    getDepartments,
    getDepartment,
    deleteDepartment,
    updateDepartment
} = require('../../controller/admin/departmentController')

// Middleware to check for authentication
// const isAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) {
//       return next();
//     }
//     res.status(401).json({ error: 'Unauthorized' });
//   };

const router = express.Router()

// require auth for all Department route

// Get all Departments
router.get('/', getDepartments)

// Get a single Department
router.get('/:id', getDepartment)

// Create a new Department
router.post('/', createDepartment)

// Delete a Department
router.delete('/:id', deleteDepartment)

// Update a Department
router.patch('/:id', updateDepartment)

module.exports = router