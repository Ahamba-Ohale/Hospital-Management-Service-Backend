const express = require('express');
const multer = require('multer');
const app = express();




// Setup Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // The directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage: storage });

// Endpoint for file uploads
app.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    // Save file details to MongoDB
    const newPhoto = new Photo({ filename: req.file.originalname });
    await newPhoto.create();
    res.json({ message: 'File uploaded successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router
