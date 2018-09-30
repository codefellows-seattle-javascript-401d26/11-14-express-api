'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');


const SeattleBar = require('../model/seattlebar');
const logger = require('../lib/logger');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();


router.post('/api/seattleBars', jsonParser, (request, response, next) => {
  return new SeattleBar(request.body).save()
    .then((savedSeattleBars) => {
      logger.log(logger.INFO, 'Responding with 200 status');
      return response.json(savedSeattleBars);
    })
    .catch(next);
});

router.get('/api/seattleBars/:id', (request, response, next) => { // I added cors here, but was throwing error
  return SeattleBar.findById(request.params.id)
    .then((seattleBar) => {
      if (seattleBar) {
        logger.log(logger.INFO, 'Responding with a 200 status and a bar');
        return response.json(seattleBar);
      }
      logger.log(logger.INFO, 'Responding with a 404 status code and seattle bar not found');
      return next(new HttpError(404, 'seattle bar not found'));
    })
    .catch(next);
});
//
// router.delete('/api/seattleBars/:id', (request, response, next) => {
//   return SeattleBar.findByIdRemove(request.params.id)
//     .then((seattleBar) => {
//       if (seattleBar) {
//         logger.log(logger.INFO, 'Bar deleted');
//         return response.json(204, seattleBar);
//       }
//       logger.log(logger.INFO, 'Responding with 404 status bar not found');
//       return next(new HttpError(404, 'Bar has not been found'));
//     })
//     .catch(next);
// });
//
// router.put('/api/seattleBars/:id', jsonParser, (request, response, next) => {
//   const updateOptions = {
//     runValidators: true,
//     new: true,
//   };
//   return SeattleBar.findByIdAndUpdate(request.params.id, request.body, updateOptions)
//     .then((updatedBar) => {
//       if (updatedBar) {
//         logger.log(logger.INFO, 'Responding with 200 status update bar');
//         return response(updatedBar);
//       }
//       logger.log(logger.INFO, 'Responding with 404 status bar not found');
//       return next(new HttpError(404, 'Bar has not been found'));
//     })
//     .catch(error => next(error));
// });
