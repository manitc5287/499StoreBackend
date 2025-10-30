const Product = require("../models/Product");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().limit(50);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST new product
const createProduct = async (req, res) => {
  const { 
    product_name, 
    brand, 
    description, 
    retail_price, 
    discounted_price, 
    category, 
    image, 
    sizes, 
    colors, 
    material, 
    stock,
    tags 
  } = req.body;

  if (!product_name || !brand || !discounted_price || !category) {
    return res
      .status(400)
      .json({ message: "Product name, brand, discounted price, and category are required" });
  }

  try {
    const newProduct = new Product({
      product_name,
      brand,
      description,
      retail_price: retail_price || discounted_price,
      discounted_price,
      category,
      image: image || [],
      sizes: sizes || [],
      colors: colors || [],
      material,
      stock: stock || 0,
      tags: tags || [],
      overall_rating: "4.0",
      rating_count: 0,
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
};
