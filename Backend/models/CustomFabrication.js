const mongoose = require('mongoose');

const fabricationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    order: { type: Number, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('CustomFabrication', fabricationSchema, 'Custom_Fabrication');
