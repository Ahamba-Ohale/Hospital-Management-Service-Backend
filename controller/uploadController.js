const Photo = require('../models/uploadModel')

const createUpload = async (req, res) => {
    try {
      // Save file details to MongoDB
      const newPhoto = new Photo({ filename: req.file.originalname });
      await newPhoto.save();
      res.json({ message: 'File uploaded successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  module.exports = {createUpload}