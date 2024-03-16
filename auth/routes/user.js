require('dotenv').config();

const router = require("express").Router();
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require('crypto');
const User = require("../models/user")
const bcrypt = require('bcryptjs');

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
    
    const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
    
    await user.save();

    await sendEmail(user.email, "Verify Email", url);
    
    return res.status(201).send({ message: "An email has been sent to your account. Please verify." });    
  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/:id/verify/:token", async (req, res) => {
    try {
    const user = await user.findOne({ _id: req.params.id });

    if (!user) return res.status(404).json({ error: "Invalid link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) return res.status(404).json({ error: "Invalid verification link" });

    await user.updateOne({ _id: user._id, verified: true });
    await token.remove();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Endpoint to fetch all registered users
router.get("/all", async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find({}, { password: 0, __v: 0 }); // Exclude password and __v fields
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});  

module.exports = router;