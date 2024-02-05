const { Schema, model } = require('mongoose');

const bandSchema = new Schema({
  band: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
});

const Band = model('Band', bandSchema);

module.exports = Band;