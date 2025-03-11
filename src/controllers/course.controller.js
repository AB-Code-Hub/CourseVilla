const Course = require('../models/course.model.js')
const User = require("../models/user.model.js");


exports.addCourse = async (req, res) => {
  try {
    const { error } = createUserValidation(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const emailAlreadyExist = await User.findOne({
      email: req.body.email,
      isDeleted: false,
    });

    if (emailAlreadyExist) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    //hash password

   

    const saveUser = await User.create(req.body);
    if (!saveUser) {
      return res.status(400).json({
        success: false,
        message: "something went wrong in creating user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Created User successfully",
      data: { saveUser },
    });
  } catch (error) {
    console.log("somethig wrong", error);
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const pageNo = req.query.pageNo;
    const pageSize = req.query.pageSize;
    const userList = await User.find({ isDeleted: false }, { password: 0 })
      .sort({ _id: -1 })
      .skip((pageNo - 1) * pageSize)
      .limit(pageSize);

    if (userList.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "User not found", data: [] });
    }

    res
      .status(200)
      .json({ success: true, message: "get all list", data: userList });
  } catch (err) {
    console.error(err);
  }
};

exports.getCourseByCourseId = async (req, res) => {
  try {
    const userId = req.query.userId;
    console.log(userId);
    if (!userId) return res.status(400).json({ message: "User id not found" });
    const getUserInfo = await User.findOne(
      { _id: userId, isDeleted: false },
      { password: 0 }
    );
    if (!getUserInfo)
      return res.status(404).json({ message: "User not found", data: {} });

    return res
      .status(200)
      .json({ success: true, message: "User Details", data: getUserInfo });
  } catch (error) {
    console.error("Error in getUserByUseId controller", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.updateCourseByCourseId = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const { error } = updateUserValidation(req.body);
    console.log(error);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const userId = req.userId;

    const detailfields = { firstName, lastName, email, password };

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      detailfields,
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    return res
      .status(200)
      .json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
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
    if (!userId) return res.status(401).json({ message: "User not verified" });

    const deleteUser = await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!deleteUser) return res.status(404).json({ message: "User not found" });

    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully", data: {} });
  } catch (error) {
    console.error("Error in deleteUserByUserId controller", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
