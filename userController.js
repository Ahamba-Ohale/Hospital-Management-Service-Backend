require('dotenv').config();

const router = require("express").Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('./userModel');
const Token = require("./utils/token");
const handlebars = require('handlebars');
const { promisify } = require('util');
const fs = require('fs');

// Function to read the HTML template file
const readHTMLTemplate = async (templatePath) => {
  try {
    const readFileAsync = promisify(fs.readFile);
    const templateContent = await readFileAsync(templatePath, 'utf8');
    return templateContent;
  } catch (error) {
    console.error(`Error reading HTML template at path ${templatePath}: ${error.message}`);
    throw new Error(`Error reading HTML template at path ${templatePath}: ${error.message}`);
  }
};

router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);

    const validationResponse = await user.customValidate();

    if (validationResponse && validationResponse.errors && Object.keys(validationResponse.errors).length > 0) {
      return res.status(400).send({ message: validationResponse.errors });
    }

    let existingEmail = await User.findOne({ email: user.email });
    if (existingEmail) {
      return res.status(409).send({ message: "User with given email already exists!" });
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).send({ confirmPassword: 'Passwords do not match' });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const hashedConfirmPassword = await bcrypt.hash(req.body.confirmPassword, salt);

    user.password = hashedPassword;
    user.confirmPassword = hashedConfirmPassword;

    const token = new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString('hex'),
    }).save();
    
    const verificationUrl = `${process.env.BASE_URL}verify-email/${user._id}/verify/${token.token}`;
    
    await user.save();
    
    await sendVerificationEmail(user.email, "Verify Email", verificationUrl);
    
    return res.status(201).send({ message: "An email has been sent to your account. Please verify." });    
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

// Function to send the verification email
const sendVerificationEmail = async (email, subject, verificationUrl) => {
  try {

    // Read the HTML template file
    const templatePath = './utils/verifyEmailTemplate.html';
    const htmlTemplate = await readHTMLTemplate(templatePath);

    // Compile the template using Handlebars
    const compiledTemplate = handlebars.compile(htmlTemplate);

    const htmlContent = compiledTemplate({
      user: { name: User.name, email: User.email },
      verificationUrl,
    });

    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      }
    })
    
    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      html: htmlContent,
    })
    console.log("Email Sent Successfully");
  } catch (error) {
    console.log("Email not sent");
    console.log(error);
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) return res.status(404).json({ error: "Invalid link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) return res.status(404).json({ error: "Invalid verification link" });

    await User.updateOne({ _id: user._id, verified: true });
    await token.remove();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).send({ message: "Invalid email" });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordValid) {
      return res.status(400).send({ message: "Invalid password" });
    }

    if (!user.isVerified) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString('hex'),
        }).save();

        const verificationUrl = `${process.env.BASE_URL}verify-email/${user._id}/verify/${token.token}`;

        // Send the email with the verification URL
        await sendVerificationEmail(user.email, "Verify Email", verificationUrl);
      }
      return res.status(400).send({ message: "An email has been sent to your account. Please verify." });
    }

    const token = user.generateAuthToken();
    return res.status(200).send({ data: token, message: "Logged in successfully" });
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.logoutUser = (req, res) => {
  // Clear the user session or token here
  req.session = null;

  // Log the successful logout
  console.log(`User logged out successfully`);

  return res.status(200).json({ message: "User logged out successfully" });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: "Email not found" });
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

    return res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (err) {
    console.error(`Error in forgotPassword: ${err.message}`);
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

    return res.status(200).send({ message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// Function to send the password reset email
const sendPasswordResetEmail = async (user, secureRandomToken) => {
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

    const resetUrl = `${process.env.BASE_URL}reset-password/${resetToken}/userId/${newUser._id}`;

    // Read the HTML template file
    const templatePath = './utils/resetEmailTemplate.html';
    const htmlTemplate = await readHTMLTemplate(templatePath);

    // Compile the template using Handlebars
    const compiledTemplate = handlebars.compile(htmlTemplate);

    const htmlContent = compiledTemplate({
      user: { name: user.name, email: user.email },
      resetUrl,
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: user.email,
      subject: "Reset Your Password",
      html: htmlContent,
    });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Error sending password reset email");
  }
};