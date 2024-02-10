const express = require('express');
const router = express.Router();
const pictureController = require('../controllers/pictureController');
const pictureUpload = require('../middleware/pictureMiddleware');

router.post('/', pictureUpload.single('picture'), pictureController.uploadPicture);
router.get('/:pictureId', pictureController.getPicture);

module.exports = router;