const TreatmentPlan = require('../../models/admin/treatmentPlanModel');
const mongoose = require('mongoose');

// Get all treatment plans
const getTreatmentPlans = async (req, res) => {    
    const treatmentPlans = await TreatmentPlan.find({}).sort({createdAt: -1})

    res.status(200).json(treatmentPlans)
}

// Get a single treatment plan
const getTreatmentPlan = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Cannot find treatment plan'})
    }

    const treatmentPlan = await TreatmentPlan.findById(id)

    if (!treatmentPlan) {
        return res.status(404).json({error: 'Cannot find treatment plan'})
    }

    res.status(200).json(treatmentPlan)
}

// Create a doctor
const createTreatmentPlan = async (req, res) => {
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

    const {description, medication, startDate, endDate} = req.body

    // Add treatment plan to db
    try {
        const treatmentPlan = await TreatmentPlan.create({description, medication, startDate, endDate});
        res.status(200).json(treatmentPlan);
    } catch (error) {
       
        res.status(400).json({error: error.message});
    }
}

// Delete a treatment plan
const deleteTreatmentPlan = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such treatment plan'})
    }

    const treatmentPlan = await TreatmentPlan.findOneAndDelete({_id: id})

    if(!treatmentPlan) {
        return res.status(400).json({error: "The treatment plan does not exist"})
    }

    res.status(200).json(treatmentPlan)
}

// Update a treatment plan
const updateTreatmentPlan = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such treatment plan'})
    }
    const treatmentPlan = await TreatmentPlan.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!treatmentPlan) {
        return res.status(400).json({error: 'Cannot find treatment plan'})
    }
    
    res.status(200).json(treatmentPlan)
}

module.exports = {
    getTreatmentPlans,
    getTreatmentPlan,
    createTreatmentPlan,
    deleteTreatmentPlan,
    updateTreatmentPlan
}