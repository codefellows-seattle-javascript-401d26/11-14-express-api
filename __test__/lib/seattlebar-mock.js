'use strict';

const faker = require('faker');
const SeattleBars = require('../../src/model/seattlebar');

const seattleBarMock = module.exports = {};

seattleBarMock.pCreateSeattleBarMock = () => {
  return new SeattleBars({
    title: faker.lorem.words(10),
    content: faker.lorem.words(10),
  }).save();
};

seattleBarMock.pCleanSeattleBarMock = () => {
  return SeattleBars.remove({});
};
