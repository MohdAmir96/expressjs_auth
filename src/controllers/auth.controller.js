const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword }); // ✅ use hashedPassword

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .cookie("token", token, COOKIE_OPTIONS)
      .status(201)
      .json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password); // Compare hashed password
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .cookie("token", token, COOKIE_OPTIONS)
      .status(200)
      .json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.logout = async (req, res) => {
  res
    .cookie("token", "", { ...COOKIE_OPTIONS, maxAge: 0 })
    .status(200)
    .json({ message: "Logged out successfully" });
};

exports.me = (req, res) => {
  const token = req.cookies.token; // read token from cookie
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ id: decoded.id, message: "User authenticated" });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
