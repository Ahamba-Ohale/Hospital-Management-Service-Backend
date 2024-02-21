// const userController = require("../controllers/userController");
// const jwt = require("jsonwebtoken");

// const authenticateUser = (req, res, next) => {
//   const token = req.header("Authorization").replace("Bearer ", "");
//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     const decoded = jwt.verify(token, "YOUR_SECRET_KEY");
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Unauthorized" });
//   }
// };

// const authorizeUser = (role) => {
//   return (req, res, next) => {
//     if (req.user.role !== role) {
//       return res.status(403).json({ message: "Forbidden" });
//     }
//     next();
//   };
// };

// module.exports = {
//   authenticateUser,
//   authorizeUser,
// };


// const jwt = require('jsonwebtoken');
// const User = require('../models/userModel');

// const authenticate = async (req, res, next) => {
//   const token = req.header('Authorization').replace('Bearer ', '');
//   const decoded = jwt.verify(token, 'secret-key');

//   const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

//   if (!user) {
//     throw new Error();
//   }

//   req.user = user;
//   req.token = token;
//   next();
// };

// module.exports = authenticate;



const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});

const authenticateAndAuthorize = async (req, res, next) => {
  const { email, verificationCode } = req.body;

  // Validate the user input
  const errors = {};
  if (!email) {
    errors.email = "Email is required";
  }
  if (!verificationCode) {
    errors.verificationCode = "Verification code is required";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ email: "User not found" });
  }

  // Check if the verification code is correct
  if (user.verificationCode !== verificationCode) {
    return res.status(401).json({ verificationCode: "Invalid verification code" });
  }

  // Check if the user is verified
  if (!user.isVerified) {
    return res.status(401).json({ message: "User is not verified. Please check your email to verify your account." });
  }

  // Add the user object to the request object
  req.user = user;

  // Call the next middleware or route handler
  next();
};

module.exports = authenticateAndAuthorize;