const mongoose = require('mongoose')

const Schema = mongoose.Schema

const patientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    sex: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true,
    },
    blood: {
        type: String,
        required: true,
    },
    genotype: {
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema)