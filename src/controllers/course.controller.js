const User = require("../models/user.model.js");
const Course = require('../models/course.model.js');
const { addCourseValidation } = require("../validation/course.validation.js");


exports.addCourse = async (req, res) => {
 try{

  // add validation
  const userId = req.userId
  const {error} = addCourseValidation(req.body)
  if(error){
    return res.status(400).json({success: false, message: error.details[0].message, data: {}})
  }


  req.body.userId = userId

// check user is User or admin
  const courseSave = await Course.create(req.body)

  if(!courseSave)
  {
    return res.status(400).json({success: false, message: "Error in creating course", data: {}},)
  }

  return res.status(201).json({success: true, message: "Course created successfully", data: courseSave})

 } catch (error) {
    console.log("somethig wrong", error);
  }
};

exports.getAllCourses = async (req, res) => {
  try{
        const courses = await Course.find({isDeleted: false}).populate('userId', 'firstName email')
        if(courses.length === 0){
            return res.status(200).json({success: true, message: "No courses found", data: []})
        }

        return res.status(200).json({success: true, message: "Courses found successfully", data: courses})
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

exports.getCourseByCourseId = async (req, res) => {
  try{

  } catch (error) {
    console.error("Error in getUserByUseId controller", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.updateCourseByCourseId = async (req, res) => {
 
 try {

 } catch (error) {
    console.error("Error in updateUserByUserId controller", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.deleteCourseByCourseId = async (req, res) => {
 try{

 } catch (error) {
    console.error("Error in deleteUserByUserId controller", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
