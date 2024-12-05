const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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


module.exports = {Signup, Signin, getAllUsers};
