const express = require('express')

const { signupUser, loginUser } = require('../controllers/userController')

const router = express.Router()

//signup route
router.post('/signup', signupUser) 

//login
router.post('/login', loginUser) 

module.exports = router