// const User = require("../models/userModel");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const emailer = require("nodemailer");
// const gTransport = require("nodemailer-sendgrid-transport");
// const crypto = require("crypto");

// const options = {
//   auth: {
//     api_key: "YOUR_SENDGRID_API_KEY",
//   },
// };

// const client = emailer.createTransport(gTransport(options));

// exports.register = async (req, res) => {
//   try {
//     const userExists = await User.findOne({ email: req.body.email });
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const user = new User(req.body);
//     await user.save();

//     const otp = crypto.randomBytes(4).toString("hex");
//     user.verificationCode = otp;
//     await user.save();

//     const mailOptions = {
//       to: user.email,
//       from: "YOUR_EMAIL_ADDRESS",
//       subject: "OTP Verification",
//       html: `<p>Your OTP is: ${otp}</p>`,
//     };

//     client.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         // Handle the error more gracefully
//         console.error("Error sending email:", error);
//         return res.status(500).json({ message: "Error sending OTP verification email" });
//       }

//       // Send a consistent response
//       res.status(201).json({
//         message: "User registered successfully. Please check your email for OTP verification.",
//         user: user,
//       });
//     });
//   } catch (error) {
//     // Send a consistent response
//     res.status(400).json({ message: error.message });
//   }
// };

// exports.verifyOTP = async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (user.verificationCode !== req.body.otp) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     user.isVerified = true;
//     await user.save();

//     res.status(200).json({ message: "OTP verified successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(req.body.password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid password" });
//     }

//     const token = jwt.sign(
//       {
//         id: user._id,
//         email: user.email,
//       },
//       "YOUR_SECRET_KEY",
//       { expiresIn: "1h" }
//     );

//     res.status(200).json({ message: "Logged in successfully", token, user });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.logout = (req, res) => {
//   try {
//     req.logout();
//     res.status(200).json({ message: "Logged out successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.uploadProfileImage = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     user.profileImage = req.file.path;
//     await user.save();

//     res.status(200).json({ message: "Profile image uploaded successfully", image: user.profileImage });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.deleteProfileImage = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     user.profileImage = undefined;
//     await user.save();

//     res.status(200).json({ message: "Profile image deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.validate = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Perform validation using secure services

//     res.status(200).json({ message: "User validated successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.addNote = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     user.notes.push(req.body.note);
//     await user.save();

//     res.status(200).json({ message: "Note added successfully", note: user.notes });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.deleteNote = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     user.notes = user.notes.filter((note) => note !== req.params.noteId);
//     await user.save();

//     res.status(200).json({ message: "Note deleted successfully", note: user.notes });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };




const mongoose = require("mongoose");
const User = require("../models/userModel");
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});

exports.register = async (req, res) => {
  const { username, email, password, contact, address, verificationCode } = req.body;

  // Validate the user input
  const errors = {};
  if (!username) {
    errors.username = "Username is required";
  }
  if (!email) {
    errors.email = "Email is required";
  }
  if (!password) {
    errors.password = "Password is required";
  }
  if (!contact) {
    errors.contact = "Contact is required";
  }
  if (!address) {
    errors.address = "Address is required";
  }
  if (!verificationCode) {
    errors.verificationCode = "Verification code is required";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ email: "Email already exists" });
  }

  // Create a new user
  const newUser = new User({
    username,
    email,
    password: bcrypt.hashSync(password, 10),
    contact,
    address,
    verificationCode
  });

  // Save the user to the database
  await newUser.save();

  // Send the verification email
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Verify your email',
    text: `Your verification code is ${verificationCode}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: "Error sending verification email" });
    }
    console.log(`Email sent: ${info.response}`);
    return res.status(201).json({ message: "User registered successfully. Please check your email to verify your account." });
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validate the user input
  const errors = {};
  if (!email) {
    errors.email = "Email is required";
  }
  if (!password) {
    errors.password = "Password is required";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ email: "User not found" });
  }

  // Check if the password is correct
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ password: "Invalid password" });
  }

  // Check if the user is verified
  if (!user.isVerified) {
    return res.status(401).json({ message: "User is not verified. Please check your email to verify your account." });
  }

  // Return the user object
  return res.status(200).json(user);
};

exports.uploadProfileImage = async (req, res) => {
  const { userId } = req.params;
  const { profileImage } = req.body;

  // Validate the user input
  const errors = {};
  if (!profileImage) {
    errors.profileImage = "Profile image is required";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  // Find the user by id
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update the user's profile image
  user.profileImage = profileImage;
  await user.save();

  // Return the updated user object
  return res.status(200).json(user);
};

exports.deleteProfileImage = async (req, res) => {
  const { userId } = req.params;

  // Find the user by id
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Delete the user's profile image
  user.profileImage = '';
  await user.save();

  // Return the updated user object
  return res.status(200).json(user);
};

exports.verifyEmail = async (req, res) => {
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

  // Verify the user's email
  user.isVerified = true;
  user.verificationCode = '';
  await user.save();

  // Return the updated user object
  return res.status(200).json(user);
};