const User = require("../models/user.model.js");
const {
  createUserValidation,
  loginUserValidation,
  updateUserValidation,
} = require("../validation/user.validation.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const otp = require("../helper/generateOTP.js");
const generateOTP = require("../helper/generateOTP.js");

exports.createUser = async (req, res) => {
  try {
    console.log(req.body);
    const { error } = createUserValidation(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const emailAlreadyExist = await User.findOne({ email: req.body.email });

    if (emailAlreadyExist) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    //hash password

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

    return res.status(200).json({
      success: true,
      message: "Created User successfully",
      data: { saveUser },
    });
  } catch (error) {
    console.log("somethig wrong", error);
  }
};

exports.loginUser = async (req, res) => {
  // add validation
  // check email is valid or not
  // check password is valid or not
  // return res

  try {
    const { email, password } = req.body;

    const { error } = loginUserValidation(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: fasle, message: error.details[0].message });
    }

    // check email is valid or not

    const verifyEmail = await User.findOne({ email: email, isDeleted: false });
    if (!verifyEmail) {
      return res.status(401).json({
        success: false,
        message: "inavlid email or email not verified",
      });
    }

    // compaire password
    const savedPassword = verifyEmail?.password;
    const verfiyPassword = await bcrypt.compare(password, savedPassword);

    if (!verfiyPassword) {
      return res
        .status(400)
        .json({ success: false, message: "password does not matched" });
    }

    // create token

    const token = jwt.sign(
      { userId: verifyEmail?._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    const userInfo = {
      token: token,
      user: verifyEmail,
    };
    return res.status(200).json({
      success: true,
      message: "login successfully",
      data: userInfo,
    });
  } catch (error) {
    console.error("error in login controller", error);
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
    console.log(userId)
    if (!userId) return res.status(400).json({ message: "User id not found" });
    const getUserInfo = await User.findOne(
      { _id: userId, isDeleted: false },
      { password: 0 }
    );
    if (!getUserInfo)
      return res.status(404).json({ message: "User not found", data: {} });

    return res.status(200).json({success: true, message: "User Details", data: getUserInfo})



  } catch (error) {
    console.error("Error in getUserByUseId controller", error);
    return res
    .status(500)
    .json({ message: "Internal server error", error: error.message });
  }
};

exports.updateUserByUserId = async (req, res) => {

  const {firstName, lastName, email, password} = req.body; 

  try {
   
         const {error} = updateUserValidation(req.body);
          console.log(error)
         if(error) return res.status(400).json({message: error.details[0].message })

    const userId = req.userId;

    const detailfields =  {firstName, lastName, email, password}

      const updatedUser = await User.findOneAndUpdate({_id: userId, isDeleted: false}, detailfields, {new: true})

      if(!updatedUser) return res.status(404).json({message: "User not found"})

        return res.status(200).json({success: true, message: "User updated successfully", data: updatedUser})

  } catch (error) {
    console.error("Error in updateUserByUserId controller", error)
    return res.status(500).json({message: "Internal server error", error: error.message})
  }
};

exports.deleteUserByUserId = async () => {

};
