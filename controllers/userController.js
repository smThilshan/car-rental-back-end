import jwt from "jsonwebtoken";

import User from "../models/User.js";
import bcrypt from "bcrypt";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
};

// Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || password.length < 8) {
      return res.json({ success: false, message: "Fill all the fields" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.json({ success: false, message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = generateToken(user._id.toString());
    res.json({ success: true, token });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Login user

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const token = generateToken(user._id.toString());
    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


// Get user data using Token
export const getUserData = async (req, res) =>{
  try {
    const {user} = req 
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
    
  }
}
