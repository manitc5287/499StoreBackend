const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  createAdmin,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/create-admin", createAdmin);

module.exports = router;
