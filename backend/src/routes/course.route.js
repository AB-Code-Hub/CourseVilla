const express = require('express')
const router = express.Router();
const courseControllers = require("../controllers/course.controller.js")

const { authrization } = require('../middleware/authrization.js');


router.post('/addCourse', authrization, courseControllers.addCourse);
router.get('/getAllCourses', authrization, courseControllers.getAllCourses);
router.get('/getCourseByCourseId', authrization, courseControllers.getCourseByCourseId);
router.put('/updateCourseByCourseId', authrization, courseControllers.updateCourseByCourseId);
router.delete('/deleteCourseByCourseId', authrization, courseControllers.deleteCourseByCourseId);


module.exports = router;

