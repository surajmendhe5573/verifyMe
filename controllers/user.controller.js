const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');

const Signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(401).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully", newUser});
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};


const Signin= async(req, res)=>{
    try {
        const {email, password}= req.body;
        const userExist= await User.findOne({email});

        if(!userExist){
           return res.status(401).json({message: "Invalid credentials"});
        }

        const isMatch= await bcrypt.compare(password, userExist.password);
        if(!isMatch){
            return res.status(401).json({message: "Invalid credentials"});
        }

        const token= jwt.sign({id: userExist._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({message: "User signed in successfully", token});
        
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
}

const getAllUsers= async(req, res)=>{
    try {
        const users= await User.find({}, '-password');  // Exclude the password field
        res.status(200).json({message: "Users retrieved successfully", users});
        
    } catch (error) {
        res.status(5000).json({message:"Internal server error"});
    }
}

// Update User 
const updateUser = async (req, res) => {
    try {
        const { id } = req.params; // Extract user ID from URL parameters
        const { username, email, password } = req.body;

        const updates = {};
        if (username) updates.username = username;
        if (email) updates.email = email;
        if (password) updates.password = await bcrypt.hash(password, 10); // Hash the new password if provided

        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", updatedUser });
    } catch (error) {
        console.error('Update User Error:', error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Delete User
const deleteUser= async(req, res)=>{
    try {
        const {id}= req.params;
        const deletedUser= await User.findByIdAndDelete(id);

        if(!deletedUser){
            return res.status(404).json({message: "User not found"});
        }

        res.status(200).json({message: "User deleted successfully", deletedUser});

    } catch (error) {
        res.status(200).json({message: "Internal server error", error});
    }
}

module.exports = {Signup, Signin, getAllUsers, updateUser, deleteUser};
