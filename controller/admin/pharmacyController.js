const Pharmacist = require('../../models/admin/pharmacyModel');
const mongoose = require('mongoose');

// Get all Pharmacist
const getPharmacists = async (req, res) => {    
    const pharmacists = await Pharmacist.find({}).sort({createdAt: -1})

    res.status(200).json(pharmacists)
}

// Get a single Pharmacist
const getPharmacist = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Cannot find Pharmacist'})
    }

    const pharmacist = await Pharmacist.findById(id)

    if (!pharmacist) {
        return res.status(404).json({error: 'Cannot find Pharmacist'})
    }

    res.status(200).json(pharmacist)
}

// Create a Pharmacist
const  createPharmacist = async (req, res) => {
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

    // Add Pharmacist to db
    try {
        const pharmacist = await Pharmacist.create({name, email, address, phone, sex});
        res.status(200).json(pharmacist);
    } catch (error) {
       
        res.status(400).json({error: error.message});
    }
}

// Delete a Pharmacist
const deletePharmacist = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such Pharmacist'})
    }

    const pharmacist = await Pharmacist.findOneAndDelete({_id: id})

    if(!pharmacist) {
        return res.status(400).json({error: "Pharmacist does not exist"})
    }

    res.status(200).json(pharmacist)
}

// Update a Pharmacist
const updatePharmacist = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such pharmacist'})
    }
    const pharmacist = await Pharmacist.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!pharmacist) {
        return res.status(400).json({error: 'Cannot find Pharmacist'})
    }
    
    res.status(200).json(pharmacist)
}

module.exports = {
    getPharmacists,
    getPharmacist,
    createPharmacist,
    deletePharmacist,
    updatePharmacist
}