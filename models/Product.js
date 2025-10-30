const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  uniq_id: String,
  crawl_timestamp: String,
  product_url: String,
  product_name: String,
  categoryTree: String,
  product_category_tree: String,
  pid: String,
  retail_price: Number,
  discounted_price: Number,
  image: {
    type: [String],     // ✅ Correct: Array of strings
    default: [],
  },
  is_FK_Advantage_product: Boolean,
  description: String,
  product_rating: String,
  overall_rating: String,
  brand: String,
  product_specifications: String,
  // New fields for variations and modern e-commerce
  sizes: [{ type: String }], // Available sizes
  colors: [{ type: String }], // Available colors
  material: { type: String }, // Material information
  stock: { type: Number, default: 0 }, // Available stock
  is_featured: { type: Boolean, default: false },
  tags: [{ type: String }], // Product tags for search
  category: { type: String }, // Main category
  rating_count: { type: Number, default: 0 }, // Number of ratings
}, { timestamps: true });
module.exports = mongoose.model("Product", productSchema);
