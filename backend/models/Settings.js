const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'global_logo',
  },
  value: {
    type: String, // Path to the logo image
    required: true,
  },
  logoSize: {
    type: Number,
    default: 80,
  },
  logoBgColor: {
    type: String,
    default: '#002d72',
  },
});

module.exports = mongoose.model('Settings', settingsSchema);
