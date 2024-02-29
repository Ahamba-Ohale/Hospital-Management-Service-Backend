const mongoose = require('mongoose');

const Schema = mongoose.Schema

const appointmentSchema = new Schema({
  patientName: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required:  true,
  },
  doctorName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
