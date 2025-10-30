const User = require("../models/User");

// Get all users (for testing)
const getUsers = async (req, res) => {
    console.log("Fetching all users");
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login user
const loginUser = async (req, res) => {

  console.log("Login attempt for email: 1", req.body.email);
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password using bcrypt
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json({
      message: "Login successful",
      user: userWithoutPassword
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Register user
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "Name, email, phone and password are required" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check if phone already exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    // Create new user
    const user = new User({
      name,
      email,
      phone,
      password
    });

    const savedUser = await user.save();
    const { password: _, ...userWithoutPassword } = savedUser.toObject();
    
    res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword
    });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ 
        message: `${field === 'email' ? 'Email' : 'Phone number'} already registered` 
      });
    }
    res.status(500).json({ message: err.message });
  }
};

// Update user profile
const updateUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const userId = req.params.id || req.body.userId;
    
    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Name, email and phone are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is being changed and if it's already taken
    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    user.name = name;
    user.email = email;
    user.phone = phone;
    
    const updatedUser = await user.save();
    const { password: _, ...userWithoutPassword } = updatedUser.toObject();
    
    res.json({
      message: "Profile updated successfully",
      user: userWithoutPassword
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.params.id || req.body.userId;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.matchPassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({
      message: "Password changed successfully"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create admin (superadmin only)
const createAdmin = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "Name, email, phone and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new admin user
    const user = new User({
      name,
      email,
      phone,
      password,
      role: 'admin'
    });

    const savedUser = await user.save();
    const { password: _, ...userWithoutPassword } = savedUser.toObject();
    
    res.status(201).json({
      message: "Admin created successfully",
      user: userWithoutPassword
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add address
const addAddress = async (req, res) => {
  try {
    const { userId, addressData } = req.body;
    
    if (!userId || !addressData) {
      return res.status(400).json({ message: "User ID and address data are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If this is the first address, make it default
    if (user.addresses.length === 0) {
      addressData.isDefault = true;
    }

    user.addresses.push(addressData);
    await user.save();

    res.status(201).json({
      message: "Address added successfully",
      addresses: user.addresses
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user addresses
const getUserAddresses = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      addresses: user.addresses
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update address
const updateAddress = async (req, res) => {
  try {
    const { userId, addressId, addressData } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ message: "Address not found" });
    }

    user.addresses[addressIndex] = { ...user.addresses[addressIndex], ...addressData };
    await user.save();

    res.json({
      message: "Address updated successfully",
      addresses: user.addresses
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete address
const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ message: "Address not found" });
    }

    const wasDefault = user.addresses[addressIndex].isDefault;
    user.addresses.splice(addressIndex, 1);

    // If we deleted the default address, make the first remaining address default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({
      message: "Address deleted successfully",
      addresses: user.addresses
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { 
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
};
