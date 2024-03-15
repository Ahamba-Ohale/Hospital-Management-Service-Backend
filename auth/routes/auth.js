const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto")

router.post("/", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
        return res.status(409).send({ message: "Invalid Email" });
        }
    
        const validPassword = await bcrypt.compare(
            req.body.password, user.password
        );
    
        if (!validPassword) {
            return res.status(400).send({ message: "Invalid Password" });
        }
    
        if (!user.isVerified) {
            let token = await Token.findOne({ userId: user._id });
            if (!token) {
                token = new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString('hex'),
                }).save();
                const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
                await sendEmail(user.email, "Verify Email", url)
            }
            return res.status(400).send({ message: "An email sent to your account. Please verify." });
            
        }

    const token = user.generateAuthToken();
    return res.status(200).send({ data: token, message: "Logged in successfully" });
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;