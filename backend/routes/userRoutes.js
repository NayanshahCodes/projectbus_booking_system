const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/person");
require("dotenv").config();

const router = express.Router();

// Register User
router.post("/signup", async (req, res) => {
  console.log("signup")
  console.log(req.body)
  const { fname,lname,phone,email,password } = req.body;
  console.log(fname,lname,phone,email,password) 
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ fname,lname,phone, email, password: hashedPassword });

  await newUser.save();
  console.log("newUser",newUser)
  res.status(201).json({ message: "User registered successfully" });
});

// Login User
router.post("/login", async (req, res) => {
  console.log("login")
  const { email, password } = req.body;
  console.log(email,password)
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    {  console.log("login failed")
      return res.status(400).json({ message: "Invalid credentials" });
       
}
  else {
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, password, { expiresIn: "1h" });
    console.log("token",token)
    console.log("login success")
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
  }
});

module.exports = router;
