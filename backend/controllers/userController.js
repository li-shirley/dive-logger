const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

// todo: implement refresh tokens
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.JWT_SECRET, {expiresIn: '1d'})
}

// signup user
const signupUser = async (req, res) => {
    const {email, password} = req.body
    const emailNormalized = email.trim().toLowerCase();

    try{
        const user = await User.signup(emailNormalized, password)

        const token = createToken(user._id)

        res.status(201).json({email, token})
    } catch (error){
        res.status(400).json({error: error.message})
    }
}

// login user
const loginUser = async (req, res) => {
    const {email, password} = req.body
    const emailNormalized = email.trim().toLowerCase();
    
    try{
        const user = await User.login(emailNormalized, password)

        const token = createToken(user._id)

        res.status(200).json({email, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports= {
    signupUser, loginUser
}