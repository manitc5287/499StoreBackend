const StoreAddress = require('../models/StoreAddress');

// Get all store addresses
exports.getStores = async (req, res) => {
  try {
    const stores = await StoreAddress.find();
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new store address (superadmin only)
exports.addStore = async (req, res) => {
  try {
    const { name, address, city, state, pincode, phone, location } = req.body;
    const store = new StoreAddress({
      name, address, city, state, pincode, phone, location,
      createdBy: req.user._id // expects auth middleware to set req.user
    });
    await store.save();
    res.status(201).json(store);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update store address (superadmin only)
exports.updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const store = await StoreAddress.findByIdAndUpdate(id, updates, { new: true });
    if (!store) return res.status(404).json({ message: 'Store not found' });
    res.json(store);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete store address (superadmin only)
exports.deleteStore = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await StoreAddress.findByIdAndDelete(id);
    if (!store) return res.status(404).json({ message: 'Store not found' });
    res.json({ message: 'Store deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
