const express = require("express");
const router = express.Router();
const { 
  getUsers, 
  loginUser, 
  registerUser, 
  updateUser, 
  changePassword, 
  createAdmin,
  addAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress
} = require("../controllers/userController");

router.get("/", getUsers);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.put("/update", updateUser);
router.put("/change-password", changePassword);
router.post("/create-admin", createAdmin);

// Address routes
router.post("/address", addAddress);
router.get("/addresses/:userId", getUserAddresses);
router.put("/address", updateAddress);
router.delete("/address", deleteAddress);

module.exports = router;
