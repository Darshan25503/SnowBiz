const { hashPassword, comparePassword } = require("../helpers/authHelper.js");
const userModel = require("../models/userModel.js");
const JWT = require("jsonwebtoken");
const sendMail = require("../Utils/sendMail.js");

exports.registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    //validation

    //check user
    const existingUser = await userModel.findOne({ email });

    //checking existing user
    if (existingUser) {
      res
        .status(201)
        .json({ success: false, message: "Already registered please login" });
    } else {
      const hashedPassword = await hashPassword(password);
      const user = await new userModel({
        name: name,
        email: email,
        password: hashedPassword,
        phone: phone,
        address: address,
      }).save();
      res
        .status(201)
        .json({ success: true, message: "user registered successfully", user });
    }
    sendMail(email, "Welcome to SnowBizz", "", name);
  } catch (error) {
    console.log(error);
    res
      .status(206)
      .json({ success: "false", message: "Error in user registration" });
  }

  //register user
};

//LOGIN CONTROLLER

exports.loginCOntroller = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "Invalid email or password" });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res
        .status(200)
        .json({ success: false, message: "invalid email or password" });
    }

    //TOKEN GENERATION

    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });
    res.status(200).json({
      success: true,
      message: "User login successfully",
      user: {
        name: user.name,
        email: user.email,
        password: user.password,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "error in login", error });
  }
};

//test controller

exports.testController = (req, res) => {
  res.status(200).json({ success: true });
};

//user signin controller

exports.userController = (req, res) => {
  res.status(200).json({ success: true });
};

//update user controller

exports.updateUserController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const user = userModel.findById(req.user._id);
    console.log(req.user._id);

    const hashedPassword = password ? await hashPassword(password) : undefined;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "User Details Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: fasle,
      message: "Internal Server error",
    });
  }
};
