const Picture = require('../models/pictureModel');

exports.uploadPicture = async (req, res, next) => {
  try {
    const picture = new Picture({
      user: req.user._id,
      imageUrl: req.file.path,
      fileName: req.file.filename
    });
    await picture.save();
    res.status(201).json({ message: 'Picture uploaded successfully', picture });
  } catch (error) {
    next(error);
  }
};

exports.getPicture = async (req, res, next) => {
  try {
    const picture = await Picture.findById(req.params.pictureId);
    if (!picture) {
      return res.status(404).json({ message: 'Picture not found' });
    }
    res.status(200).json({ picture });
  } catch (error) {
    next(error);
  }
};