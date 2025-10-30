const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class AuthService {
  generateToken(id, role) {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  }

  async register(userData) {
    const { name, email, password } = userData;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = await User.create({ 
      name, 
      email, 
      password, 
      role: "customer" 
    });

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: this.generateToken(user._id, user.role),
    };
  }

  async login(credentials) {
    const { email, password } = credentials;

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: this.generateToken(user._id, user.role),
    };
  }
}

module.exports = new AuthService();