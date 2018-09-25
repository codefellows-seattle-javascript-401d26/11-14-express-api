'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const SeattleBars = require('../model/seattlebar');
const logger = require('../lib/logger');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();


const barStorageById = [];
const barStorageByHash = {};

router.post('/api/seattlebar', jsonParser, (request, response) => {
  logger.log(logger.INFO, 'Processing a POST request on /api/seattlebar');
  //----------------------------------------------------------------------------------
  // REQUEST VALIDATION
  //----------------------------------------------------------------------------------
  if (!request.body) {
    logger.log(logger.INFO, 'Resonding with a 400 status code');
    return response.sendStatus(400);
  }
  if (!request.body.title) {
    logger.log(logger.INFO, 'Resonding with a 400 status code');
    return response.sendStatus(400);
  }

  if (!request.body.content) {
    logger.log(logger.INFO, 'Resonding with a 400 status code');
    return response.sendStatus(400);
  }
  //----------------------------------------------------------------------------------
  // NOTE CREATION
  //----------------------------------------------------------------------------------
  const seattleBars = new SeattleBars(request.body.title, request.body.content);
  barStorageById.push(seattleBars.id);

  logger.log(logger.INFO, 'Responding with a 200 status code and a json object');
  logger.log(logger.INFO, barStorageById);
  logger.log(logger.INFO, barStorageByHash);
  return response.json(seattleBars);
});

router.get('/api/seattlebar/:id', (request, response) => {
  logger.log(logger.INFO, 'Processing a GET request on /api/seattlebar');
  logger.log(logger.INFO, `Trying to get an object with id ${request.params.id}`);

  if (barStorageByHash[request.params.id]) {
    logger.log(logger.INFO, 'Responding with a 200 status code and json data');
    return response.json(barStorageByHash[request.params.id]);
  }
  logger.log(logger.INFO, 'Responding with a 404 status code. The seattle bar was not found');
  return response.sendStatus(404);
});

// router.delete('/api/seattlebar/:id', (request, response) => {
//   barStorage.splice(barStorage.indexOf(request.url.query(request)), 1);
//   sendStatus(204, `${request.url.query(request)} no longer exists.`, response);
//   return undefined;
// });
