const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/isAuth");

const router = express.Router();

// register route
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Fields must not be empty" });
  }

  try {
    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      name: newUser.username,
      token: jwt.sign({ id: newUser._id }, process.env.JWT_SECRET),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// login route

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email Address" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Password does not match" });
    }

    res.status(201).json({
      success: true,
      name: user.username,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// get ID

router.get("/getID", auth, async (req, res) => {
  try {
    const user = req.user[0];
    const userID = await User.findOne({ _id: user._id }).select("_id");

    res.status(200).json({ success: true, userID });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;