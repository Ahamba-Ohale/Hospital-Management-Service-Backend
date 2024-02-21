require('dotenv').config();

const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

exports.registerUser = async (req, res) => {
  try {
    const newUser = new User(req.body);

    // Call the asynchronous custom validation method with await
    const validationResponse = await newUser.customValidate();

    if (validationResponse && validationResponse.errors && Object.keys(validationResponse.errors).length > 0) {
      return res.status(400).json({ message: validationResponse.errors });
    }

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ email: "Email already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    newUser.password = hashedPassword;

    // Set isVerified to true when generating the verification code
    newUser.isVerified = true;

    // Check if the verification code is expired
    if (newUser.verificationCodeExpiry && newUser.verificationCodeExpiry < new Date()) {
      // Generate a new verification code
      newUser.verificationCode = crypto.randomBytes(6).toString("hex");
      // Set a new expiration time (e.g., 1 hour from now)
      newUser.verificationCodeExpiry = new Date();
      newUser.verificationCodeExpiry.setHours(newUser.verificationCodeExpiry.getHours() + 1);
    } else {
      // Generate a verification code for the user
      newUser.verificationCode = crypto.randomBytes(6).toString("hex");
      // Set the expiration time (e.g., 1 hour from now)
      newUser.verificationCodeExpiry = new Date();
      newUser.verificationCodeExpiry.setHours(newUser.verificationCodeExpiry.getHours() + 1);
    }

    // Save the user, including the default values for the verification code
    await newUser.save();

    // Send the verification email
    await sendVerificationEmail(newUser);

    return res.status(201).json(newUser);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const sendVerificationEmail = async (user) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { 
      user: process.env.EMAIL, 
      pass: process.env.EMAIL_PASS 
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: "Verify your email",
    html: `
      <p>Thank you for registering! Please verify your email by clicking the link below:</p>
      <a href="${process.env.BASE_URL}/verify?userId=${user._id}&verificationCode=${user.verificationCode}">
        Verify Email
      </a>
    `,
  };

  await transporter.sendMail(mailOptions);
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ email: "Invalid email" });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ password: "Invalid password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "User is not verified" });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.verifyUser = async (req, res) => {
  const { verificationCode } = req.body;
  const userId = req.query.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Check if the user is already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    // Check if the verification code is missing or incorrect
    if (!user.verificationCode || user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Check if the verification code has expired (assuming verificationCodeExpiry is a Date)
    if (user.verificationCodeExpiry && user.verificationCodeExpiry < new Date()) {
      return res.status(400).json({ message: "Verification code has expired" });
    }

    // Mark the user as verified and clear verification-related fields
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpiry = null;

    await user.save();

    return res.status(200).json({ message: "User verified successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.logoutUser = (req, res) => {
  // Clear the user session or token here
  req.session = null;
  return res.status(200).json({ message: "User logged out successfully" });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ email: "Email not found" });
    }

    // Generate a more secure random password reset token
    const secureRandomToken = crypto.randomBytes(32).toString("hex");

    user.passwordResetToken = secureRandomToken;
    user.passwordResetTokenExpiry = new Date();
    user.passwordResetTokenExpiry.setHours(
      user.passwordResetTokenExpiry.getHours() + 1
    );
    await user.save();

    // Send the email with the more secure token
    await sendPasswordResetEmail(user, secureRandomToken);

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { password, resetToken, userId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (
      user.passwordResetToken !== resetToken ||
      user.passwordResetTokenExpiry < new Date()
    ) {
      return res.status(400).json({ message: "Invalid password reset token" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetTokenExpiry = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { 
      user: process.env.EMAIL, 
      pass: process.env.EMAIL_PASS 
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: "Reset your password",
    text: `Your password reset token is ${resetToken}`,
  };

  await transporter.sendMail(mailOptions);
};