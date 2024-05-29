const express = require("express");
const {
  registerController,
  loginCOntroller,
  testController,
  userController,
  updateUserController,
} = require("../controllers/authController.js");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware.js");

//router object

const router = express.Router();

//routing
//REGISTER || METHOD POST

router.post("/register", registerController);

//LOGIN || POST

router.post("/login", loginCOntroller);

//TEST ROUTE

router.get("/admin-test", requireSignIn, isAdmin, testController);

//SIGNIN Check

router.get("/user-test", requireSignIn, userController);

//user profile update

router.put("/profile", requireSignIn, updateUserController);

module.exports = router;
