'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');

const ModelUser = require('../model/user-template');
const logger = require('../lib/logger');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

// development note:
const storageById = []; // easy access //
const storageByHash = {}; // fast access //

// home
router.get('/', (request, response) => {
  logger.log(logger.INFO, '200 - Welcome to the Jungle /');
  return response.status(200).send('<!DOCTYPE><header></header><body><div><p>cool beans.</p></div></body></html>');
});

router.post('/new/user', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, 'Processing a POST request on /new/user');
  if (!request.body) {
    return next(new HttpError(400, 'body not found on request.')); // eslint-disable-line no-undef
  }

  if (!request.body.username) {
    return next(new HttpError(400, 'username not found on request.')); // eslint-disable-line no-undef
  }

  if (!request.body.title) {
    return next(new HttpError(400, 'title not found on request.')); // eslint-disable-line no-undef
  }
  //----------------------------------------------------------------------------------
  // User Creation
  //----------------------------------------------------------------------------------
  const user = new ModelUser(request.body.username, request.body.title);
  storageById.push(user.id);
  storageByHash[user.id] = user;

  logger.log(logger.INFO, 'Responding with a 200 status code and a json abject');
  logger.log(logger.INFO, storageById);
  logger.log(logger.INFO, storageByHash);
  return response.json(user);
});

router.get('/login/:id', (request, response) => {
  logger.log(logger.INFO, 'GET - /login/([$id])');
  logger.log(logger.INFO, `Trying: ${request.params.id}`);
  //----------------------------------------------------------------------------------
  // User retrieval
  //----------------------------------------------------------------------------------
  if (storageByHash[request.params.id]) {
    logger.log(logger.INFO, '200 - returning json data.');
    return response.json(storageByHash[request.params.id]); // O(1)
  }
  return next(new HttpError(404, 'User was not found.')); // eslint-disable-line no-undef
});

router.delete('/login/:id', (request, response, next) => {
  logger.log(logger.INFO, 'DELETE - /login/([$id])');
  logger.log(logger.INFO, `Attempting delete on: ${request.params.id}`);
  //! development note:
  //   delete is true always true if object exists... be careful
  if (storageByHash[request.params.id]) {
    logger.log(logger.INFO, 'current user list:');
    console.log(storageByHash);
    const indexToRm = storageById.indexOf(request.params.id);
    storageById.splice(indexToRm, 1);
    delete storageByHash[request.params.id];
    logger.log(logger.INFO, '200 - user removed.');
    return response.status(204).json(storageByHash); // O(1)
  }
  return next(new HttpError(404, ' User was not found.'));
});

// if someone tries to use login path to delete without giving an id
router.delete('/login', (request, response) => {
  const badDelete = {
    id: 'blank',
    error: '204',
    route: '/login',
    'recommended route': '/login/:id',
  };
  return response.json(badDelete).status(204);
});

router.put('/login/:id', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, `Trying to update storage object @id: ${request.params.id}`);

  if (storageByHash[request.params.id]) {
    logger.log(logger.INFO, 'Object property acquired... updating.');

    if (request.body.username) {
      storageByHash[request.params.id].username = request.body.username;
    }
    if (request.body.title) {
      storageByHash[request.params.id].title = request.body.title;
    }

    return response.json(storageByHash[request.params.id]);
  }
  return next(new HttpError(404, 'User not found.'));
});
