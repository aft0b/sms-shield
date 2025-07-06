const mongoose = require('mongoose');

const PhoneNumberSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  protectedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PhoneNumber', PhoneNumberSchema);
