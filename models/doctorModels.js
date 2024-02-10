const mongoose = require('mongoose')

const Schema = mongoose.Schema

const doctorSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true 
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    specialty: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema)