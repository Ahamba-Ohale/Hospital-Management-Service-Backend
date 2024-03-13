const mongoose = require('mongoose')

const Schema = mongoose.Schema

const patientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: { 
        type: String, 
        required: true 
      },
    phoneNumber: { 
        type: String, 
        required: true 
      },
    address: { 
        type: String 
    },
    bloodType: {
        type: String,
        required: true,
    },
    genotype: {
        type: String,
        required: false,
    },
    dateOfBirth: { 
        type: Date, 
        required: true 
    },
    gender: { 
        type: String, 
        enum: ['Male', 'Female', 'Other'], 
        required: true 
    },
    provider: { 
      type: String 
    },
    policyNumber: { 
      type: String 
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    }
    },
    { timestamps: true }
  );


module.exports = mongoose.model('Patient', patientSchema)