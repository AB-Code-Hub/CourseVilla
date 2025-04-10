const express = require('express')
const router = express.Router();
const userControllers = require('../controllers/user.controller.js');
const { authrization } = require('../middleware/authrization.js');


router.post('/createUser', userControllers.createUser);
router.post('/loginUser', userControllers.loginUser);
router.post('/logoutUser', authrization, userControllers.logoutUser);
router.get('/getAllUsers', authrization, userControllers.getAllUsers);
router.get('/getUserByUserId', authrization, userControllers.getUserByUserId);
router.get('/profile', authrization, userControllers.profile);
router.post('/addUser', authrization, userControllers.addUser);
router.put('/updateUserByUserId', authrization, userControllers.updateUserByUserId);
router.delete('/deleteUserByUserId', authrization, userControllers.deleteUserByUserId);



module.exports = router;

