const Doctor = require('../../models/doctorModels');
const mongoose = require('mongoose');

// Get all doctors
const getDoctors = async (req, res) => {    
    const doctors = await Doctor.find({}).sort({createdAt: -1})

    res.status(200).json(doctors)
}

// Get a single workout
const getDoctor = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Cannot find doctor'})
    }

    const doctor = await Doctor.findById(id)

    if (!doctor) {
        return res.status(404).json({error: 'Cannot find doctor'})
    }

    res.status(200).json(doctor)
}

// Create a doctor
const createDoctor = async (req, res) => {
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

    const {fullname, email, phone, address, specialty} = req.body

    // Add doctor to db
    try {
        const doctor = await Doctor.create({fullname, email, phone, address, specialty});
        res.status(200).json(doctor);
    } catch (error) {
       
        res.status(400).json({error: error.message});
    }
}

// Delete a doctor
const deleteDoctor = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such doctor'})
    }

    const doctor = await Doctor.findOneAndDelete({_id: id})

    if(!doctor) {
        return res.status(400).json({error: "The doctor does not exist"})
    }

    res.status(200).json(doctor)
}

// Update a doctor
const updateDoctor = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such doctor'})
    }
    const doctor = await Doctor.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!doctor) {
        return res.status(400).json({error: 'Cannot find doctor'})
    }
    
    res.status(200).json(doctor)
}

module.exports = {
    getDoctors,
    getDoctor,
    createDoctor,
    deleteDoctor,
    updateDoctor
}