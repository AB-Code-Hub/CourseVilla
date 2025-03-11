const User = require("../models/user.model.js");
const Course = require('../models/course.model.js');
const { addCourseValidation } = require("../validation/course.validation.js");


exports.addCourse = async (req, res) => {
 try{

  // add validation
  const {error} = addCourseValidation(req.body)
  if(error){
    return res.status(400).json({success: false, message: error.details[0].message, data: {}})
  }

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

  } catch (err) {
    console.error(err);
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
