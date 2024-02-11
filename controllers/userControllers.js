const User = require('../models/User');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  const user = new User({ username, email, password });

  try {
    await user.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid email or password' });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};