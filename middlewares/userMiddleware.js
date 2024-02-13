const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const captcha = require("captcha");

exports.authenticateUser = async (req, res, next) => {
    const { email, password, captchaResponse } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: "Invalid email" });
        }

        const captchaImage = captcha.create({
            fontSize: 50,
            width: 150,
            height: 50,
        });

        const captchaText = captchaImage.text;
        req.session.captchaText = captchaText;

        if (captchaText.toLowerCase() !== captchaResponse.toLowerCase()) {
            return res.status(400).json({ msg: "Invalid captcha" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ msg: "Invalid password" });
        }

        const payload = { user: { id: user.id } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

exports.authorizeUser = async (req, res, next) => {
    try {
        const token = req.header("x-auth-token");

        if (!token) {
            return res.status(401).json({ msg: "No token, authorization denied" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded.user;

        next();
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};