'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const User = require('../model/user-template');
const logger = require('../lib/logger');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

//                    development note:                       //
const storageById = []; // easy access //
const storageByHash = {}; // fast access //

// home
router.get('/', (request, response) => {
  logger.log(logger.INFO, '200 - Welcome to the Jungle /');
  return response.status(200).send('<!DOCTYPE><header></header><body><div><p>cool beans.</p></div></body></html>');
});

router.post('/new/user', jsonParser, (request, response) => {
  logger.log(logger.INFO, 'Processing a POST request on /api/notes');
  if (!request.body) {
    logger.log(logger.INFO, '400 - body not found on request.');
    return response.sendStatus(400);
  }

  if (!request.body.username) {
    logger.log(logger.INFO, '400 - username not found on request.');
    return response.sendStatus(400);
  }

  if (!request.body.title) {
    logger.log(logger.INFO, '400 - title not found on request.');
    return response.sendStatus(400);
  }
  //----------------------------------------------------------------------------------
  // User Creation
  //----------------------------------------------------------------------------------
  const user = new User(request.body.username, request.body.title);
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
  logger.log(logger.INFO, '404 - User was not found.');
  return response.sendStatus(404);
});

router.delete('/login/:id', (request, response) => {
  logger.log(logger.INFO, 'DELETE - /login/([$id])');
  logger.log(logger.INFO, `Attempting delete on: ${request.params.id}`);
  //! development note:
  //   delete is true always true if object exists... be careful
  if (storageByHash[request.params.id]) {
    logger.log(logger.INFO, 'current user list:');
    console.log(storageByHash);
    delete storageByHash[request.params.id];
    logger.log(logger.INFO, '200 - user removed.');
    return response.json(storageByHash); // O(1)
  }

  logger.log(logger.INFO, '404 - User was not found.');
  return response.status(404).json(storageByHash);
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
