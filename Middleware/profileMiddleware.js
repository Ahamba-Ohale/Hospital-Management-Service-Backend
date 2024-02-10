// middleware/ProfilePictureMiddleware.js
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const ProfilePictureMiddleware = (req, res, next) => {
  if (req.path.startsWith('/api/profile/picture')) {
    upload.single('picture')(req, res, (err) => {
      if (err) {
        return res.status(400).json({      });
      }

      const userId = req.query.userId;
      const imageData = req.file.buffer;
      const contentType = req.file.mimetype;
      req.profilePicture = new ProfilePicture(userId, imageData, contentType);
      next();
    });
  } else {
    next();
  }
};  
      const userId = req.query.userId;
      const imageData = req.file.buffer;
      const contentType = req.file

module.exports = ProfilePictureMiddleware;