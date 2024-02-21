// const express = require("express");
// const router = express.Router();
// const {
//   authenticateUser,
//   authorizeUser,
// } = require("../middlewares/userMiddleware");
// const {
//   register,
//   verifyOTP,
//   login,
//   logout,
//   uploadProfileImage,
//   deleteProfileImage,
//   validate,
//   addNote,
//   deleteNote,
// } = require("../controllers/userController");

// router.post("/register", register);
// router.post("/verify-otp", verifyOTP);
// router.post("/login", login);

// router.use(authenticateUser);
// router.get("/profile", authorizeUser("user"), (req, res) => {
//   res.status(200).json({ message: "Welcome to your profile", user: req.user });
// });

// router.post("/upload-profile-image/:id", uploadProfileImage);
// router.post("/delete-profile-image/:id", deleteProfileImage);
// router.post("/validate/:id", validate);

// router.post("/add-note/:id", addNote);
// router.post("/delete-note/:id/:noteId", deleteNote);

// module.exports = router;


const express = require("express");
const router = express.Router
const { authenticateUser, authorizeUser } = require("../middlewares/userMiddleware");
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

// Register a new user
router.post("/register", register);

// Verify OTP
router.post("/verify-otp", verifyOTP);

// Login a user
router.post("/login", login);

// Logout a user
router.post("/logout", logout);

// Protected routes that require authentication
router.use(authenticateUser);

// Get the current authenticated user's profile
router.get("/profile", authorizeUser("user"), (req, res) => {
  res.status(200).json({ message: "Welcome to your profile", user: req.user });
});

// Upload a profile image
router.post("/upload-profile-image/:id", uploadProfileImage);

// Delete a profile image
router.post("/delete-profile-image/:id", deleteProfileImage);

// Validate a user
router.post("/validate/:id", validate);

// Add a note
router.post("/add-note/:id", addNote);

// Delete a note
router.post("/delete-note/:id/:noteId", deleteNote);

module.exports = router;