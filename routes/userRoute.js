const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizeUser,
} = require("../middlewares/auth");
const {
  register,
  verifyOTP,
  login,
  logout,
  uploadProfileImage,
  deleteProfileImage,
  validate,
  addNote,
  deleteNote,
} = require("../controllers/userController");

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);

router.use(authenticateUser);
router.get("/profile", authorizeUser("user"), (req, res) => {
  res.status(200).json({ message: "Welcome to your profile", user: req.user });
});

router.post("/upload-profile-image/:id", uploadProfileImage);
router.post("/delete-profile-image/:id", deleteProfileImage);
router.post("/validate/:id", validate);

router.post("/add-note/:id", addNote);
router.post("/delete-note/:id/:noteId", deleteNote);

module.exports = router;