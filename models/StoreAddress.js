const mongoose = require('mongoose');

const storeAddressSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Store name
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  phone: { type: String },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // superadmin
}, { timestamps: true });

storeAddressSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('StoreAddress', storeAddressSchema);
