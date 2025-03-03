const express = require('express')
const router = express.Router();
const userControllers = require('../controllers/user.controller')


router.post('/createUser', userControllers.createUser);
router.post('/loginUser', userControllers.loginUser);
router.get('/getAllUsers', userControllers.getAllUsers);
router.get('/getUserByUserId/:userId', userControllers.getUserByUserId);
router.get('/updateUserByUserId', userControllers.updateUserByUserId);
router.get('/deleteUserByUserId', userControllers.deleteUserByUserId);


module.exports = router;

