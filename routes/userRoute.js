// Import the necessary modules
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const userMiddleware = require("../middlewares/userMiddleware");

// Register a new user
router.post(
    "/register",
    userMiddleware.authenticateUser,
    userController.registerWithCaptcha
);

// Log in a user
router.post(
    "/login",
    userMiddleware.authorizeUser,
    userController.verifyUser
);

// Logout a user
router.get(
    '/logout', 
    userController.logout
);

// Export the router as a module
module.exports = router;
