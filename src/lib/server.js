'use strict';

const express = require('express');
const logger = require('./logger');

const seattleBarRouter = require('../routes/seattle-bars-router');

const app = express();

//-------------------------------------------------

app.use(seattleBarRouter);

app.all('*', (request, response) => {
  logger.log(logger.INFO, 'Returning a 404 from a catch/all default route/');
  return response.sendStatus(404);
});

const server = module.exports = {};
let internalServer = null;

server.start = () => {
  internalServer = app.listen(process.env.PORT, () => {
    logger.log(logger.INFO, `Server is on at PORT: ${process.env.PORT}`);
  });
};

server.stop = () => {
  internalServer.close(() => {
    logger.log(logger.INFO, 'The server is OFF.');
  });
};
