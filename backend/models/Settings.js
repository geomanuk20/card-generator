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
});

module.exports = mongoose.model('Settings', settingsSchema);
