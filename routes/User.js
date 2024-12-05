const express= require('express');
const {Signup, Signin, getAllUsers, updateUser} = require('../controllers/user.controller');
const router= express.Router();


router.post('/signup', Signup);
router.post('/signin', Signin);
router.get('/', getAllUsers);
router.put('/:id', updateUser); 

module.exports= router;