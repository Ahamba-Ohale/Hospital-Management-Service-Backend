const Department = require('../../models/admin/departmentModel');
const mongoose = require('mongoose');

// Get all department
const getDepartments = async (req, res) => {    
    const departments = await Department.find({}).sort({createdAt: -1})

    res.status(200).json(departments)
}

// Get a single department
const getDepartment = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Cannot find Department'})
    }

    const department = await Department.findById(id)

    if (!department) {
        return res.status(404).json({error: 'Cannot find doctor'})
    }

    res.status(200).json(department)
}

// Create a department
const createDepartment = async (req, res) => {
    // console.log('Creating a new doctor...')
    // const user_id = req.user._id;

    // let emptyFields = [];

    // if (!req.body.name) {
    //     emptyFields.push('fullname');
    // }
    // if (!req.body.email) {
    //     emptyFields.push('email');
    // }
    // if (!req.body.phone) {
    //     emptyFields.push('phone');
    // }
    // if (!req.body.address) {
    //     emptyFields.push('address');
    // }
    // if (!req.body.specialty) {
    //     emptyFields.push('specialty');
    // }

    // if (emptyFields.length > 0) {
    //     console.log('Error: Missing required fields', emptyFields);
    //     return res.status(400).json({ error: 'Please fill in all the fields', emptyFields });
    // }

    const {name, description} = req.body

    // Add department to db
    try {
        const department = await Department.create({name, description});
        res.status(200).json(department);
    } catch (error) {
       
        res.status(400).json({error: error.message});
    }
}

// Delete a department
const deleteDepartment = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such department'})
    }

    const department = await Department.findOneAndDelete({_id: id})

    if(!department) {
        return res.status(400).json({error: "Department does not exist"})
    }

    res.status(200).json(department)
}

// Update a department
const updateDepartment = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such department'})
    }
    const department = await Department.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!department) {
        return res.status(400).json({error: 'Cannot find department'})
    }
    
    res.status(200).json(department)
}

module.exports = {
    getDepartments,
    getDepartment,
    createDepartment,
    deleteDepartment,
    updateDepartment
}