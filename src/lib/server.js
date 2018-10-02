'use strict';

const express = require('express');
const mongoose = require('mongoose');
const logger = require('./logger');
const loggerMiddleware = require('../lib/logger-middleware');
const errorMiddleware = require('../lib/error-middleware');

const seattleBarRouter = require('../routes/seattle-bars-router');

const app = express();
//-------------------------------------------------

// app.use(cors());
app.use(loggerMiddleware);

app.use(seattleBarRouter);

app.all('*', (request, response) => {
  logger.log(logger.INFO, 'Returning a 404 from a catch/all default route/');
  return response.sendStatus(404);
});

app.use(errorMiddleware);

const server = module.exports = {};
let internalServer = null;

server.start = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      return internalServer = app.listen(process.env.PORT, () => { //eslint-disable-line
        logger.log(logger.INFO, `Server is on at PORT: ${process.env.PORT}`);
      });
    });
};

server.stop = () => {
  return mongoose.disconnect()
    .then(() => {
      return internalServer.close(() => {
        logger.log(logger.INFO, 'The server is OFF.');
      });
    });
};
