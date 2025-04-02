const express = require('express')
const router = express.Router();
const userControllers = require('../controllers/user.controller.js');
const { authrization } = require('../middleware/authrization.js');


router.post('/createUser', userControllers.createUser);
router.post('/loginUser', userControllers.loginUser);
router.get('/getAllUsers', authrization, userControllers.getAllUsers);
router.get('/getUserByUserId', authrization, userControllers.getUserByUserId);
router.put('/updateUserByUserId', authrization, userControllers.updateUserByUserId);
router.delete('/deleteUserByUserId', authrization, userControllers.deleteUserByUserId);


module.exports = router;

