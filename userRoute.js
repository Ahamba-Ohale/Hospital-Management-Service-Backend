const express = require('express');
const router = express.Router();
const userController = require('./userController');

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.post('/logout', userController.logoutUser);

// Verification route with placeholders for parameters
router.get('/verify-email/:token/:userId', userController.verifyEmail);

module.exports = router;