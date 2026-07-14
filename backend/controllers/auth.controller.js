import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"


// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" })
}

// @desc  Register a new user
// @route  POST /api/auth/register
// @access Public
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImageUrl } = req.body
        
        // Check if user alredy exists
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({ message: "User already exists" })
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Randomly choose a profile image from the enums
        const profileImages = User.schema.path('profileImageUrl').enumValues;
        const profileImg = profileImages[Math.floor(Math.random() * profileImages.length)];

        // Create user
        const user = await User.create({ name, email, password: hashedPassword, profileImageUrl: profileImg })

        // Return user data with JWT
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: profileImg,
            token: generateToken(user._id)
        })
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message })
    }
}

 
// @desc  Login user
// @route  POST /api/auth/login
// @access Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password or email" })
        }     
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id)
        })
  
    } catch (error) {
        console.log("Error logging in:", error)
        res.status(500).json({ message: "Error logging in", error: error.message })
    }
}

// @desc  Get user profile
// @route  GET /api/auth/profile
// @access Private
export const getUserprofile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if(!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: "Error getting user profile" })
    }
}
