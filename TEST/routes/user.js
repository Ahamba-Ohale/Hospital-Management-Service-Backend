const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcryptjs");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto")

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send({ message: error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(409).send({ message: "User with given email already exists!" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    user = await new User({...req.body, password: hashPassword}).save();

    const token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString('hex'),
    }).save();
      
    const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;

    await sendEmail(user.email, "Verify Email", url);
    
    res.status(201).send({ message: "An email has been sent to your account. Please verify." });    
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:id/verify/:token", async (req, res) => {
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
})

module.exports = router;