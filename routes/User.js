const express= require('express');
const {Signup, Signin, getAllUsers} = require('../controllers/user.controller');
const router= express.Router();


router.post('/signup', Signup);
router.post('/signin', Signin);
router.get('/', getAllUsers);

module.exports= router;