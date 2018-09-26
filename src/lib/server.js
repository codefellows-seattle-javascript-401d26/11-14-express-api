'use strict';

const express = require('express');
const cors = require('cors');
const logger = require('./logger');
const loggerMiddleware = require('../lib/logger-middleware');
const errorMiddleware = require('../lib/error-middleware');

const seattleBarRouter = require('../routes/seattle-bars-router');

const app = express();
//-------------------------------------------------

app.use(cors());
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
  internalServer = app.listen(process.env.PORT, () => {
    logger.log(logger.INFO, `Server is on at PORT: ${process.env.PORT}`);
  });
};
server.stop = () => {
  internalServer.close(() => {
    logger.log(logger.INFO, 'The server is OFF.');
  });
};
