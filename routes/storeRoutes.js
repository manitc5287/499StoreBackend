const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public: get all stores
router.get('/', storeController.getStores);

// Superadmin only: add/update/delete
router.post('/', protect, adminOnly, storeController.addStore);
router.put('/:id', protect, adminOnly, storeController.updateStore);
router.delete('/:id', protect, adminOnly, storeController.deleteStore);

module.exports = router;
