const User = require('../models/userModel')

const asyncHandler = require('express-async-handler')

//step 2 using json webtoken and password thingy
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// @desc Get user data
// @route Get /api/users/me
// @access private
// Step 4 Protect route --> authMiddleware.js
const getMe = asyncHandler( async (req, res) => { //using protect gives the id as a pass through Step 4
    const {_id, name, email} = await User.findById(req.user.id)
    res.status(200).json({
        id:_id,
        name, 
        email
    })
})

// @desc Register User/////
// @route Post /api/users
// @access Public
const registerUser = asyncHandler( async (req, res) => {
    //ask for the parameters
    const { name, email, password} = req.body
    if(!name || !email || !password){
        res.status(400)
        throw new Error('Please add all fields') //errorMiddle.js
    }
    // Check if user exist
    const userExists = await User.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error('User already exists')
    }
    //Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //Create user
    const user = await User.create({
        name, email, password: hashedPassword
    })
    
    if(user){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        }) //print out
    } else{
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc Authenticate a user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler( async (req, res) => {
    const {email, password} = req.body

    //Check for user email
    const user = await User.findOne({email})
                    //the password is hasahed and needs to be compared with what they inputted using this method
    if(user && (await bcrypt.compare(password, user.password)) ){
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id) //This token using jwt.io can show the id, iat, exp, used to validate
        })
    }else{
        res.status(400)
        throw new Error('Invalid Crediantials');
    }
    res.json({message: 'Log in User'})
})//gets email and password from body  findOne email from User

//GENERATE TOKEN STEP 3

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '7d',
    })
}// signs id passed in, signed with .env value, and expires in 7 days


module.exports = {
    getMe,
    registerUser,
    loginUser,
}