const Vitals = require('../../models/admin/vitalsModel')
const mongoose = require( 'mongoose' )

// Create a treatment plan
const createVital = async (req, res) => {
    const {type, value, unit, date} = req.body

    try {
        const vital = await  Vitals.create({type, value, unit, date})
        
        if(!vital){
            return res.status(401).json({message: "Failed to add new vital"})
        }

        res.status(200).json({vital, message:"New vital added successfully!"})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//  Get all vitals for a specific patient
const getVitals = async (req, res) =>{
    const {id: patientId} = req.params;
    
    const vitals = await  Vitals.find({patient_id: patientId});
     
    if (!vitals || vitals.length === 0) {
        return res.status(404).json({message: "No vitals found."})
    }
  
    res.status(200).json(vitals)
}

//  Retrieve a single vital by its id
const getVitalById = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Cannot find treatment plan'})
    }

    const vital = await Vitals.findById(id)

    if(!vital){
        return res.status(404).json({message: "Vital not found."})
    }

    res.status(200).json(vital)
}

// Update an existing vital
const updateVital = async (req,res)=>{
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such treatment plan'})
    }

    const vital = await Vitals.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!vital) {
        return res.status(400).json({error: 'Cannot find patients vitals'})
    }
    res.status(200).json(vital)
}

const  deleteVital = async (req, res) =>{
    const {id} = req.params;

    const vital = await Vitals.FindOneAndDelete({ _id : id})
    
    if (!vital) {
      return res.status(400).json({error:"No record with that identifier has been found."});
    }
  
    res.status(200).json(vital);
  };

module.exports = {
    createVital,
    getVitals, 
    getVitalById,  
    updateVital, 
    deleteVital
};