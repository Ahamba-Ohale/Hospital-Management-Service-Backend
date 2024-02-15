const mongoose = require('mongoose');


// Create a Photo model (MongoDB Schema)
const photoSchema = new mongoose.Schema({
    filename: String,
    // other fields as needed
  });

const Photo = mongoose.model('Photo', photoSchema);
