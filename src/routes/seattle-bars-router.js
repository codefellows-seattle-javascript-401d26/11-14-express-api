'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');


const SeattleBars = require('../model/seattlebar');
const logger = require('../lib/logger');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();


router.post('/api/seattlebar', jsonParser, (request, response, next) => {
  return new SeattleBars(request.body).save()
    .then((savedSeattleBars) => {
      logger.log(logger.INFO, 'Responding with 200 status');
      return response.json(savedSeattleBars);
    })
    .catch(next);
});

router.get('/api/seattlebar/:id', (request, response, next) => { // I added cors here, but was throwing error
  return SeattleBars.findById(request.params.id)
    .then((seattlebar) => {
      if (seattlebar) {
        logger.log(logger.INFO, 'Responding with a 200 status and a bar');
        return response.json(seattlebar);
      }
      logger.log(logger.INFO, 'Responding with a 404 status code and seattle bar not found');
      return next(new HttpError(404, 'seattle bar not found'));
    })
    .catch(next); // by default a catch gets a error as a first argument. Express
  // knows to immdieatly calls the error-logger
});

// router.delete('/api/seattlebar/:id', (request, response, next) => {
//   return SeattleBars.findByIdAndDelete(request.params.id)
//     .then((seattlebars) => {
//       if (seattlebars) {
//         logger.log(logger.INFO, 'Correct bar has been found to delete');
//         return response.sendStatus(204);
//       }
//       return next(new HttpError(404, 'The seattle bar has not been found'));
//     });

//   const barToRemove = barStorageById.indexOf(request.params.id);
//   barStorageById.splice(barToRemove, 1);
//   delete barStorageByHash[request.params.id];
//   return response.sendStatus(204);
// }


// router.put('/api/seattlebar/:id', jsonParser, (request, response, next) => {
//   return SeattleBars.findByIdAndUpdate(request.params.id)
//     .then((seattlebars) => {
//       if (seattlebars) {
//         logger.log(logger.INFO, 'We found the bar to update');
//         logger.log(logger.INFO, seattlebars);
//       }
//     });
//
//   if (barStorageByHash[request.params.id]) {
//     logger.log(logger.INFO, 'We found the bar to update');
//     if (request.body.title) {
//       barStorageByHash[request.params.id].title = request.body.title;
//     }
//     if (request.body.content) {
//       barStorageByHash[request.params.id].content = request.body.content;
//     }
//     return response.json(barStorageByHash[request.params.id]);
//   }
//   return next(new HttpError(404, 'The Seattle bar has not been found'));
// });
