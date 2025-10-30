const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
} = require("../controllers/productController");

// GET all products
router.get("/", getProducts);

// GET product by ID
router.get("/:id", getProductById);

// POST new product
router.post("/", createProduct);

module.exports = router;
