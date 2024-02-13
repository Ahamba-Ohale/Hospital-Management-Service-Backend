const mongoose = require('mongoose')

const Schema = mongoose.Schema

const pharmacistSchema = new Schema({
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
    }
}, { timestamps: true });

module.exports = mongoose.model('Pharmacist', pharmacistSchema)