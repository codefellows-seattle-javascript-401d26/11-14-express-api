'use strict';

// development note: needed to include this twice...
require('dotenv').config(); //   look into why later

const express = require('express');
const logger = require('./logger');
const loggerMiddleware = require('./logger-middleware');
const errorMiddleware = require('./error-middleware');

const userRoutes = require('../routes/user-router');

const app = express();

// development note: can't get .env file to work in this code...
process.env.PORT = 4000; // hard coding process.env.PORT for now

//-------------------------------------------------------------------------------------------------
// ROUTES
//-------------------------------------------------------------------------------------------------

// middleware
app.use(loggerMiddleware);
app.use(userRoutes);

app.all('*', (request, response) => {
  logger.log(logger.INFO, '404 - catch-all/default route (route was not found)');
  return response.sendStatus(404);
});

// middleware
app.use(errorMiddleware);

//-------------------------------------------------------------------------------------------------
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
