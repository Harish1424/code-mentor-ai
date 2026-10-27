const User = require("../models/User");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if all fields are filled
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    // Check if email already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User Registered Successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check all fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    // Generate Token
    const token = jwt.sign(
      { id: user._id },
      "codementor_secret",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};                                                                                    