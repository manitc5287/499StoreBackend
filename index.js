// ...existing code...
const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// load .env from backend folder explicitly
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

const MONGO_URI = process.env.MONGO_URI;

console.log("Loaded .env from:", path.resolve(__dirname, ".env"));
console.log(
  "MONGO_URI:",
  MONGO_URI ? MONGO_URI.replace(/(\/\/.*:).*@/, "$1***@") : null
);

if (!MONGO_URI) {
  console.error(
    "MONGO_URI is not set. Create backend/.env or set the environment variable and restart the server."
  );
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes (require as usual)
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

const connectDB = async (retries = 3) => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log(`Connected to DB: ${conn.connection.name}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message || error);
    if (retries > 0) {
      console.log(`Retrying MongoDB connection (${retries} attempts left)...`);
      await new Promise((res) => setTimeout(res, 3000));
      return connectDB(retries - 1);
    }
    process.exit(1);
  }
};

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();