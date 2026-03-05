const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const exist = await User.findOne({ email });
  if (exist) return res.json({ message: "User already exists" });

  const hashPass = await bcrypt.hash(password, 10);

  const user = new User({ name, email, password: hashPass });
  await user.save();

  res.json({ message: "Signup successful" });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ message: "Incorrect password" });

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);

  res.json({ message: "Login successful", token });
});

module.exports = router;
