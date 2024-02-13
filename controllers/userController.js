const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const captcha = require("captcha");

exports.registerWithCaptcha = async (req, res) => {
    const { name, email, password, contact, captcha } = req.body;

    if (captcha.toLowerCase() !== req.session.captcha.toLowerCase()) {
        return res.status(400).json({ msg: "Invalid captcha" });
    }

    try {
        let user = await User.findOne({ name });

        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // Validate the contact field
        const phoneRegex = /^(\+\d{1,3}|0)\d{9,11}$/;
        if (!phoneRegex.test(contact)) {
            return res.status(400).json({ msg: "Invalid contact number" });
        }

        user = new User({ name, email, password, contact, captcha });

        await user.save();

        // Store the user data in the request object
        req.user = user;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        user.verificationCode = verificationCode;

        await user.save();

        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Account Verification",
            text: `Please verify your account by clicking this link: ${process.env.CLIENT_URL}/verify/${user.id}?code=${verificationCode}`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error(err);
                res.status(500).send("Server error");
            } else {
                console.log("Email sent: " + info.response);
                res.status(201).json({ msg: "User registered successfully" });
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

exports.verifyUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(400).json({ msg: "Invalid user" });
        }

        const verificationCode = req.query.code;

        if (verificationCode !== user.verificationCode) {
            return res.status(400).json({ msg: "Invalid verification code" });
        }

        user.isVerified = true;

        await user.save();

        res.status(201).json({ msg: "User verified successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

exports.logout = (req, res) => {
    // Clear the JWT token from the client-side or set it to expire immediately
    res.cookie('token', '', { expires: new Date(0) });
    res.redirect('/');
  };