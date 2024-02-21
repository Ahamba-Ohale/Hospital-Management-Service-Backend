const mongoose = require('mongoose')

const Schema = mongoose.Schema

const medicalHistorySchema = new Schema({
    pastIllnesses: { type: String },
    surgeries: { type: String },
    allergies: { type: String },
    medications: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('MedicalHistory', medicalHistorySchema)