'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');


const SeattleBars = require('../model/seattlebar');
const logger = require('../lib/logger');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();


const barStorageById = [];
const barStorageByHash = {};

router.use(cors());

router.post('/api/seattlebar', jsonParser, (request, response, next) => {
  //----------------------------------------------------------------------------------
  // REQUEST VALIDATION
  //----------------------------------------------------------------------------------
  if (!request.body) {
    return next(new HttpError(400, 'body is required'));
  }
  if (!request.body.title) {
    return next(new HttpError(400, 'title is required'));
  }

  if (!request.body.content) {
    return next(new HttpError(400, 'content is required'));
  }
  //----------------------------------------------------------------------------------
  // NOTE CREATION
  //----------------------------------------------------------------------------------
  const seattleBars = new SeattleBars(request.body.title, request.body.content);
  barStorageById.push(seattleBars.id);
  barStorageByHash[seattleBars.id] = seattleBars;

  logger.log(logger.INFO, 'Responding with a 200 status code and a json object');
  logger.log(logger.INFO, barStorageById);
  logger.log(logger.INFO, barStorageByHash);
  return response.json(seattleBars);
});

router.get('/api/seattlebar/:id', (request, response, next) => { // I added cors here, but was throwing error
  logger.log(logger.INFO, `Trying to get an object with id ${request.params.id}`);
  // response.json({ msg: 'This is CORS-enabled for a single route' });

  if (barStorageByHash[request.params.id]) {
    logger.log(logger.INFO, 'Responding with a 200 status code and json data');
    return response.json(barStorageByHash[request.params.id]);
  }
  return next(new HttpError(404, 'The seattle bar was not found'));
});

router.delete('/api/seattlebar/:id', (request, response, next) => {
  logger.log(logger.INFO, 'The bar has been found to be deleted');

  if (barStorageByHash[request.params.id]) {
    logger.log(logger.INFO, 'The correct bar has been found to delete');
    const barToRemove = barStorageById.indexOf(request.params.id);
    barStorageById.splice(barToRemove, 1);
    delete barStorageByHash[request.params.id];
    return response.sendStatus(204);
  }
  return next(new HttpError(404, 'The seattle bar has not been found'));
});

router.put('/api/seattlebar/:id', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, `Trying to update a bar with id ${request.params.id}`);

  if (barStorageByHash[request.params.id]) {
    logger.log(logger.INFO, 'We found the bar to update');
    if (request.body.title) {
      barStorageByHash[request.params.id].title = request.body.title;
    }
    if (request.body.content) {
      barStorageByHash[request.params.id].content = request.body.content;
    }
    return response.json(barStorageByHash[request.params.id]);
  }
  return next(new HttpError(404, 'The Seattle bar has not been found'));
});
