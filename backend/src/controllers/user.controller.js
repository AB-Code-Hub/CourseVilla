const User = require("../models/user.model.js");
const {
  createUserValidation,
  loginUserValidation,
  updateUserValidation,
  AddUserValidation,
} = require("../validation/user.validation.js");
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");
const generateOTP = require("../helper/generateOTP.js");

exports.createUser = async (req, res) => {
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

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    const otpCode = generateOTP.generateOTP();
    console.log(otpCode);
    req.body.otp = otpCode;

    const saveUser = await User.create(req.body);
    if (!saveUser) {
      return res.status(400).json({
        success: false,
        message: "something went wrong in creating user",
      });
    }

    const user = await User.findOne({ email: req.body.email });
    const token = jwt.sign(
      { userId: user?._id, role: user?.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    return res.status(200).json({
      success: true,
      message: "Created User successfully",
      data: { saveUser, token: token },
    });
  } catch (error) {
    console.log("somethig wrong", error);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { error } = loginUserValidation(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const verifyEmail = await User.findOne({ email: email, isDeleted: false });
    if (!verifyEmail) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or email not verified",
      });
    }

    const savedPassword = verifyEmail?.password;
    const verifyPassword = await bcrypt.compare(password, savedPassword);

    if (!verifyPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Password does not match" });
    }

    const token = jwt.sign(
      { userId: verifyEmail?._id, role: verifyEmail?.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: { user: verifyEmail,  token: token, },
     
    });
  } catch (error) {
    console.error("Error in loginUser controller", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
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

exports.getUserByUserId = async (req, res) => {
  try {
    const userId = req.query.userId;
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

exports.updateUserByUserId = async (req, res) => {
  try {
    const { error } = updateUserValidation(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Use the request body directly as the update fields
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      req.body,
      { new: true }
    ).select('-password'); // Exclude password from response

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

exports.deleteUserByUserId = async (req, res) => {
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

exports.logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Error in logoutUser controller", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.profile = async (req, res) => {
  try {
    const userId = req.userId
    const user = await User.findOne({ _id: userId, isDeleted: false}).select("-password")
    if(!user){
      return res.status(404).json({message: "User not found"})
    }

    return res.status(200).json({user})
  } catch (error) {
    res.status(500).json({message: "Internal server error"})
  }
}

exports.addUser = async (req, res) => {
  try {
    
    const { error } = AddUserValidation(req.body);

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

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    const otpCode = generateOTP.generateOTP();
    console.log(otpCode);
    req.body.otp = otpCode;

    const saveUser = await User.create(req.body);
    if (!saveUser) {
      return res.status(400).json({
        success: false,
        message: "something went wrong in creating user",
      });
    }

    const user = await User.findOne({ email: req.body.email });
    const token = jwt.sign(
      { userId: user?._id, role: user?.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    return res.status(200).json({
      success: true,
      message: "Created User successfully",
      data: { saveUser, token: token },
    });
  } catch (error) {
    console.log("somethig wrong", error);
  }
};
