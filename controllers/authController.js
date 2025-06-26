const User = require("../models/UserModel");

const register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = user.generateToken();
    res
      .status(201)
      .json({ user: { username: user.username, id: user._id }, token });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = user.generateToken();
    res
      .status(200)
      .json({ user: { username: user.username, id: user._id }, token });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getUser = async (req, res) => {
  res.status(200).json({ user: req.user });
};

module.exports = { register, login, getUser };
