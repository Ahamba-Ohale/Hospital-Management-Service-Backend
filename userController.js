require('dotenv').config();

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('./userModel');
const Token = require("./utils/token");

exports.registerUser = async (req, res) => {
  try {
    const newUser = new User(req.body);

    const validationResponse = await newUser.customValidate();

    if (validationResponse && validationResponse.errors && Object.keys(validationResponse.errors).length > 0) {
      return res.status(400).json({ message: validationResponse.errors });
    }

    const existingEmail = await User.findOne({ email: newUser.email });
    if (existingEmail) {
      return res.status(409).send({ message: "User with given email already exists!" });
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({ confirmPassword: 'Passwords do not match' });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const hashedConfirmPassword = await bcrypt.hash(req.body.confirmPassword, salt);

    newUser.password = hashedPassword;
    newUser.confirmPassword = hashedConfirmPassword;

    const token = new Token({
      userId: newUser._id,
      token: crypto.randomBytes(32).toString('hex'),
    });

    const url = `${process.env.BASE_URL}users/${newUser._id}/verify/${token.token}`;

    await newUser.save();
    await token.save();

    await sendVerificationEmail(newUser.email, "Verify Email", url);

    return res.status(201).send({ message: "An email has been sent to your account. Please verify." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const sendVerificationEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
    });
    console.log("Email sent Successfully");
  } catch (error) {
    console.log("Email not sent");
    console.log(error);
  }
};

exports.verifyEmail = async (req, res) => {
  const userId = req.query.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "Invalid link" });
    }

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) return res.status(400).send({ message: "Invalid link" });

    user.verified = true;
    await token.remove();

    await user.save();

    return res.status(200).send({ message: "Email verified successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      let authToken = await Token.findOne({ userId: user._id });
      if (!authToken) {
        authToken = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString('hex'),
        }).save();

        const url = `${process.env.BASE_URL}users/${user._id}/verify/${authToken.token}`;
        await sendVerificationEmail(user.email, "Verify Email", url);
      }

      return res.status(403).json({ message: "An Email has been sent to your account. Please verify" });
    }

    const authToken = user.generateAuthToken();
    res.status(200).send({ data: authToken, message: "Logged in successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
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
    const secureRandomToken = crypto.randomBytes(32).toString('hex');

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
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
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

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetTokenExpiry = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const sendPasswordResetEmail = async (user, resetToken) => {
  // Implement the logic to send the password reset email
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const resetUrl = `${process.env.BASE_URL}reset-password?token=${resetToken}&userId=${user._id}`;
    
    await transporter.sendMail({
      from: process.env.USER,
      to: user.email,
      subject: "Reset Your Password",
      text: `Click on the following link to reset your password: ${resetUrl}`,
    });

    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Error sending password reset email");
  }
};