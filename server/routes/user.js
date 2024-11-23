const express = require('express');
const router = express.Router();
const { loginUser, signUpUser } = require('../controllers/user');

// login
router.post('/login', loginUser);

// sign up
router.post('/sign-up', signUpUser);

module.exports = router;
