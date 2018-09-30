'use strict';

const mongoose = require('mongoose');

const barSchema = mongoose.Schema({
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
    minLength: 5,
  },
});

module.exports = mongoose.model('seattleBar', barSchema);
