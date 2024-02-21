const Nurse = require('../../models/admin/nurseModel');
const mongoose = require('mongoose');

// Get all Nurses
const getNurses = async (req, res) => {    
    const nurses = await Nurse.find({}).sort({createdAt: -1})

    res.status(200).json(nurses)
}

// Get a single Nurse
const getNurse = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Cannot find Nurse'})
    }

    const nurse = await Nurse.findById(id)

    if (!nurse) {
        return res.status(404).json({error: 'Cannot find Nurse'})
    }

    res.status(200).json(nurse)
}

// Create a patient
const  createNurse = async (req, res) => {
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

    const {name, email, address, phone, sex} = req.body

    // Add Nurse to db
    try {
        const nurse = await Nurse.create({name, email, address, phone, sex});
        res.status(200).json(nurse);
    } catch (error) {
       
        res.status(400).json({error: error.message});
    }
}

// Delete a Nurse
const deleteNurse = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such nurse'})
    }

    const nurse = await Nurse.findOneAndDelete({_id: id})

    if(!nurse) {
        return res.status(400).json({error: "Nurse does not exist"})
    }

    res.status(200).json(nurse)
}

// Update a Nurse
const updateNurse = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such nurse'})
    }
    const nurse = await Nurse.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!nurse) {
        return res.status(400).json({error: 'Cannot find nurse'})
    }
    
    res.status(200).json(nurse)
}

module.exports = {
    getNurses,
    getNurse,
    createNurse,
    deleteNurse,
    updateNurse
}