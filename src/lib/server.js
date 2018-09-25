'use strict';

require('dotenv').config();
const express = require('express');
const logger = require('./logger');
const noteRoutes = require('../routes/user-router');

const app = express();

// can't get .env file to work in this code... hard coding process.env.PORT for now
process.env.PORT = 4000;

//-------------------------------------------------------------------------------------------------
// ROUTES
//-------------------------------------------------------------------------------------------------
app.use(noteRoutes);

app.all('*', (request, response) => {
  logger.log(logger.INFO, '404 - catch-all/default route (route was not found)');
  return response.sendStatus(404);
});
//-------------------------------------------------------------------------------------------------
const server = module.exports = {};
let internalServer = null;

server.start = () => {
  //! Vinicio - the next line will start the server and make it listen to request
  internalServer = app.listen(process.env.PORT, () => {
    logger.log(logger.INFO, `Server is on at PORT: ${process.env.PORT}`);
  });
};

server.stop = () => {
  internalServer.close(() => {
    logger.log(logger.INFO, 'The server is OFF.');
  });
};
