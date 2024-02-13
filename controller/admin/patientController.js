const Patient = require('../../models/admin/patientModel');
const mongoose = require('mongoose');

// Get all department
const getPatients = async (req, res) => {    
    const patients = await Patient.find({}).sort({createdAt: -1})

    res.status(200).json(patients)
}

// Get a single Patient
const getPatient = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Cannot find Patient'})
    }

    const patient = await Patient.findById(id)

    if (!patient) {
        return res.status(404).json({error: 'Cannot fpatient'})
    }

    res.status(200).json(patient)
}

// Create a patient
const  createPatient = async (req, res) => {
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

    const {name, email, address, phone, sex, dob, age, blood, genotype} = req.body

    // Add patient to db
    try {
        const patient = await Patient.create({name, email, address, phone, sex, dob, age, blood, genotype});
        res.status(200).json(patient);
    } catch (error) {
       
        res.status(400).json({error: error.message});
    }
}

// Delete a Patient
const deletePatient = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such patient'})
    }

    const patient = await Patient.findOneAndDelete({_id: id})

    if(!patient) {
        return res.status(400).json({error: "Patient does not exist"})
    }

    res.status(200).json(patient)
}

// Update a Patient
const updatePatient = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such patient'})
    }
    const patient = await Patient.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!patient) {
        return res.status(400).json({error: 'Cannot find patient'})
    }
    
    res.status(200).json(patient)
}

module.exports = {
    getPatients,
    getPatient,
    createPatient,
    deletePatient,
    updatePatient
}