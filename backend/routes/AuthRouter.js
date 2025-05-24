const { signup, login } = require('../controller/AuthController');
const { signupValidation, loginValidation } = require('../middlewares/AuthValidation');
const express = require('express');
const router = express.Router();


router.post('/login', loginValidation, login);
router.post('/signup',signupValidation, signup);

module.exports = router;

