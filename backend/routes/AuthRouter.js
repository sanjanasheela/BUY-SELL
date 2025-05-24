const { signup, login } = require('../controller/AuthController');
const { signupValidation, loginValidation } = require('../middlewares/AuthValidation');
const express = require('express');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;



router.post('/login', loginValidation, login);
router.post('/signup',signupValidation, signup);
router.get('/verify', (req, res) => {
    console.log("inside the verify thing")
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ valid: false, message: 'No token provided' });
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      res.json({ valid: true, user: decoded });
    } catch (err) {
      res.status(401).json({ valid: false, message: 'Invalid token' });
    }
  });
module.exports = router;

