'use strict';

const mongoose = require('mongoose');

// class SeattleBars {
//   constructor(title, content) {
//     this.id = uuid();
//     this.title = title;
//     this.content = content;
//   }
// }

const barSchema = mongoose.Schema({
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

module.exports = mongoose.model('seattlebar', barSchema);
