'use strict';


const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');


const SeattleBar = require('../model/seattlebar');
const logger = require('../lib/logger');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();


router.post('/api/seattlebar', jsonParser, (request, response, next) => {
  return new SeattleBar(request.body).save()
    .then((savedSeattleBar) => {
      logger.log(logger.INFO, 'Responding with 200 status');
      return response.json(savedSeattleBar);
    })
    .catch(next);
});

router.get('/api/seattlebar/:id', (request, response, next) => {
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

router.delete('/api/seattlebar/:id', (request, response, next) => {
  return SeattleBar.findByIdAndDelete(request.params.id)
    .then((seattleBar) => {
      if (seattleBar) {
        logger.log(logger.INFO, 'Bar deleted');
        return response.json(204, seattleBar);
      }
      logger.log(logger.INFO, 'Responding with 404 status bar not found');
      return next(new HttpError(404, 'Bar has not been found'));
    })
    .catch(next);
});

// router.put('/api/seattlebar/:id', jsonParser, (request, response, next) => {
//   return SeattleBar.findById(request.params.id)
//     .then((seattleBar) => {
//       if (!request.content) {
//         throw HttpError(400, 'content is required');
//       }
//       if (!seattleBar) {
//         throw HttpError(400, 'not bar found');
//       }
//       if (request.body.title) {
//         seattleBar.set({
//           title: `${request.body.title}`,
//         });
//       }
//       if (request.body.content) {
//         seattleBar.set({
//           content: `${request.body.content}`,
//         });
//       }
//       logger.log(logger.INFO, 'Responding with 200 status update bar');
//       return seattleBar.save()
//         .then(updatedSeattleBar => response.json(updatedSeattleBar))
//         .catch(next);
//     })
//     .catch(next);
// });
