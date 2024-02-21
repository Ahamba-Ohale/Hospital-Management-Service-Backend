const mongoose = require('mongoose')

const Schema = mongoose.Schema

const patientSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    contactInformation: {
        email: { 
            type: String, 
            required: true },
        phoneNumber: { 
            type: String, 
            required: true },
        address: { type: String },
      },
    bloodType: {
        type: String,
        required: true,
    },
    genotype: {
        type: String,
        required: false,
    },
    demographicDetails: {
        dateOfBirth: { 
            type: Date, 
            required: true 
        },
        gender: { 
            type: String, 
            enum: ['Male', 'Female', 'Other'], 
            required: true 
        },
      },
      insuranceInformation: {
        provider: { type: String },
        policyNumber: { type: String },
      }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema)