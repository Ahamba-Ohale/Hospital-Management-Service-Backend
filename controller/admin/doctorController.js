const Doctor = require('../../models/doctorModels');
const mongoose = require('mongoose');

// Get all doctors
const getDoctors = async (req, res) => {
    const user_id = req.user._id
    
    const doctors = await Doctor.find({ user_id }).sort({createdAt: -1})

    res.status(200).json(doctors)
}

// Get a single workout
const getDoctor = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such doctor'})
    }

    const doctor = await Doctor.findById(id)

    if (!doctor) {
        return res.status(404).json({error: 'Cannot find doctor'})
    }

    res.status(200).json(doctor)
}

// Create a doctor
const createDoctor = async (req, res) => {
    const user_id = req.user._id;

    let emptyFields = [];

    if (!req.body.name) {
        emptyFields.push('fullname');
    }
    if (!req.body.email) {
        emptyFields.push('email');
    }
    if (!req.body.phone) {
        emptyFields.push('phone');
    }
    if (!req.body.address) {
        emptyFields.push('address');
    }
    if (!req.body.specialty) {
        emptyFields.push('specialty');
    }

    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields });
    }

    const doctor = new Doctor({
        fullname: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        specialty: req.body.specialty,
        user_id
    });

    try {
        const newDoctor = await doctor.save();
        res.status(200).json(newDoctor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}



// const createDoctor = async (req, res) => {
//     const user_id = req.user._id;
//     const doctor = new Doctor({
//         fullname: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone,
//         address: req.body.address,
//         specialty: req.body.specialty,
//         user_id
//       });

//     let emptyFields = []

//     if(!name) {
//         emptyFields.push('fullname')
//     }
//     if(!email) {
//         emptyFields.push('email')
//     }
//     if(!password) {
//         emptyFields.push('password')
//     }
//     if(!address) {
//         emptyFields.push('address')
//     }
//     if(!phone) {
//         emptyFields.push('phone')
//     }
//     if(!specialty) {
//         emptyFields.push('specialty')
//     }

// if(emptyFields.length > 0) {
//     return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
// }

    // add doc to db
    // try {
        // const user_id = req.user._id
//         const newDoctor = await doctor.save()
//         res.status(200).json(newDoctor);
//     } catch (error) {
//         res.status(400).json({error: error.message})
//     }
// }

// Delete a doctor
const deleteDoctor = async (req, res) => {
    const {id} = req.params.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such doctor'})
    }

    const doctor = await Doctor.findOneAndDelete({_id: id})

    res.status(200).json(doctor, { message: 'Deleted Doctor' } )
}

// Update a doctor
const updateDoctor = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such doctor'})
    }
    const doctor = await Doctor.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!doctor) {
        return res.status(400).json({error: 'Cannot find doctor'})
    }

    doctor.fullname = req.body.fullname || doctor.fullname;
    doctor.email = req.body.email || doctor.email;
    doctor.specialty = req.body.specialty || doctor.specialty;
    doctor.clinic = req.body.clinic || doctor.clinic;
    doctor.phone = req.body.phone || doctor.phone;

    const updatedDoctor = await doctor.save();
    
    res.status(200).json(doctor, updatedDoctor)
}

module.exports = {
    getDoctors,
    getDoctor,
    createDoctor,
    deleteDoctor,
    updateDoctor
}