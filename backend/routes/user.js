const express = require('express')

const { signupUser, loginUser, refreshAccessToken, logoutUser } = require('../controllers/userController')

const router = express.Router()

// signup route
router.post('/signup', signupUser)

// login
router.post('/login', loginUser)

// refresh token
router.post('/refresh', refreshAccessToken);

// logout
router.post('/logout', logoutUser);

module.exports = router