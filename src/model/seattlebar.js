'use strict';

const uuid = require('uuid/v1');

class SeattleBars {
  constructor(title, content) {
    this.id = uuid();
    // this.location =location;

    this.title = title;
    this.content = content;
  }
}

module.exports = SeattleBars;
