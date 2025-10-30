const authService = require("../services/authService");

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const userData = await authService.register(req.body);
    res.status(201).json(userData);
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const userData = await authService.login(req.body);
    res.status(200).json(userData);
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: error.message 
    });
  }
};


// ✅ Create Admin (superadmin only)
const createAdmin = async (req, res) => {
  try {
    const { name, email, password, superAdminSecret } = req.body;

    if (superAdminSecret !== process.env.SUPER_ADMIN_SECRET)
      return res.status(403).json({ message: "Unauthorized" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Admin already exists" });

    const admin = await User.create({ name, email, password, role: "admin" });

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id, admin.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

module.exports = { registerUser, loginUser };
