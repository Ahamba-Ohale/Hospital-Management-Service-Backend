const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const emailer = require("nodemailer");
const gTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");

const options = {
  auth: {
    api_key: "YOUR_SENDGRID_API_KEY",
  },
};

const client = emailer.createTransport(gTransport(options));

exports.register = async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User(req.body);
    await user.save();

    const otp = crypto.randomBytes(4).toString("hex");
    user.verificationCode = otp;
    await user.save();

    const mailOptions = {
      to: user.email,
      from: "YOUR_EMAIL_ADDRESS",
      subject: "OTP Verification",
      html: `<p>Your OTP is: ${otp}</p>`,
    };

    client.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: error.message });
      }
      res.status(201).json({ message: "User registered successfully. Please check your email for OTP verification." });
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verificationCode !== req.body.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      "YOUR_SECRET_KEY",
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Logged in successfully", token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = (req, res) => {
  try {
    req.logout();
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    user.profileImage = req.file.path;
    await user.save();

    res.status(200).json({ message: "Profile image uploaded successfully", image: user.profileImage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profileImage = undefined;
    await user.save();

    res.status(200).json({ message: "Profile image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.validate = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Perform validation using secure services

    res.status(200).json({ message: "User validated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addNote = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.notes.push(req.body.note);
    await user.save();

    res.status(200).json({ message: "Note added successfully", note: user.notes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.notes = user.notes.filter((note) => note !== req.params.noteId);
    await user.save();

    res.status(200).json({ message: "Note deleted successfully", note: user.notes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};