const User = require("../models/user.model.js");
const Course = require("../models/course.model.js");
const { addCourseValidation, updateCourseValidation } = require("../validation/course.validation.js");
const { getIO } = require("../config/socket");

exports.addCourse = async (req, res) => {
  try {
    // add validation
    const userId = req.userId;
    const name = req.body.name?.toLowerCase();
    const { error } = addCourseValidation(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message, data: {} });
    }

    // check user is User or admin

    const verifyAdminRole = await User.findOne({
      _id: userId,
      isDeleted: false,
      role: "admin",
    });

    if (!verifyAdminRole) {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to create course",
        data: {},
      });
    }

    // checking Already course created or not  

    const courseAlreadyExists = await Course.findOne({
      name: name,
      isDeleted: false,
    });

    if (courseAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "Course already exists", data: {} });
    }
    // save course
    req.body.name = name;
    req.body.userId = userId;
    const courseSave = await Course.create(req.body);

    if (!courseSave) {
      return res.status(400).json({
        success: false,
        message: "Error in creating course",
        data: {},
      });
    }

    // Emit new course event
    const io = getIO();
    io.emit('newCourse', {
      course: courseSave.title,
      action: 'created',
      time: new Date().toISOString()
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: courseSave,
    });
  } catch (error) {
    console.error("Error in addCourse controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const pageNo = req.query.pageNo || 1;
    const pageSize = req.query.pageSize || 10;
    const totalCourse = await Course.countDocuments({ isDeleted: false });
    const totalPage = Math.ceil(totalCourse / pageSize);
    const courses = await Course.find({ isDeleted: false })

      .populate("userId", "firstName email")
      .sort({ _id: -1 })
      .skip((pageNo - 1) * pageSize)
      .limit(pageSize);
    if (courses.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No courses found", data: [] });
    }

    const response = {
      currentPage: pageNo,
      pageSize,
      totalPage,
      totalCourse,
      courseList: courses,
    };

    return res.status(200).json({
      success: true,
      message: "Courses found successfully",
      data: response,
    });
  } catch (err) {
    console.error("Error in course find controller", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.getCourseByCourseId = async (req, res) => {
  try {
    const courseId = req.query.courseId;

    const getCourse = await Course.findOne({
      _id: courseId,
      isDeleted: false,
    }).populate("userId", "firstName lastName email");

    if (!getCourse)
      return res
        .status(400)
        .json({ success: false, message: "Course Not Found" });

    return res
      .status(200)
      .json({ success: true, message: "Course Details", data: getCourse });
  } catch (error) {
    console.error("Error in getUserByUseId controller", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.updateCourseByCourseId = async (req, res) => {
  try {

        const userId = req.userId
        const courseId = req.query.courseId

      const { error } = updateCourseValidation(req.body)

      if(error) return res.status(400).json({success: false, message: error.details[0].message, data: {}})

        const userRole = await User.findOne({ _id: userId, isDeleted: false })

        if(userRole.role === "user"){
            return res.status(403).json({success: false, message: "Access Denied", data: {}})
        }


        const updateCourseInfo = await Course.findOneAndUpdate({_id: courseId, isDeleted: false, }, req.body, {new: true})

        if(!updateCourseInfo) return res.status(403).json({success: false, message: "Can't update details", data: {}})

          return res.status(200).json({success: true, message: "Details updated successsfully", data: updateCourseInfo})

  } catch (error) {
    console.error("Error in updateUserByUserId controller", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.deleteCourseByCourseId = async (req, res) => {
  try {     
          const userId = req.userId;
          const courseId = req.query.courseId;

          const userRole = await User.findOne({_id: userId, isDeleted: false}, {role: 1})


          if(userRole.role !== "admin"){
            return res.status(403).json({success: false, message: "Access Denied"})
          }

            const deleteCourseInfo = await Course.findOneAndUpdate(
            { _id: courseId, isDeleted: false },
            { $set: { isDeleted: true } },
            { new: true }
            );

            if (!deleteCourseInfo) {
            return res.status(400).json({
              success: false,
              message: "Course not found or already deleted",
              data: {},
            });
            }

            return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
            data: deleteCourseInfo,
            });

  } catch (error) {
    console.error("Error in deleteUserByUserId controller", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};




