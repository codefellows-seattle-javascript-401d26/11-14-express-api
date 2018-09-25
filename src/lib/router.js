'use strict';

const logger = require('./logger');
const requestParser = require('./request-parser');

const routeHandlers = {
  POST: {},
  GET: {},
  PUT: {},
  DELETE: {},
};

const router = module.exports = {};

const logRouteAndCallback = (method, route) => {
  logger.log(logger.INFO, `Adding a ${method} handler on the '${route}' route`);
  // logger.log(logger.INFO, callback.toString());
};
//-------------------------------------------------------------------------------
// These functions are to add new routes
//-------------------------------------------------------------------------------
router.get = (route, callback) => {
  routeHandlers.GET[route] = callback;
  logRouteAndCallback('GET', route);
};

router.put = (route, callback) => {
  routeHandlers.PUT[route] = callback;
  logRouteAndCallback('PUT', route);
};

router.post = (route, callback) => {
  routeHandlers.POST[route] = callback;
  logRouteAndCallback('POST', route);
};

router.delete = (route, callback) => {
  routeHandlers.DELETE[route] = callback;
  logRouteAndCallback('DELETE', route);
};
//-------------------------------------------------------------------------------
// This function is going to find and execute callbacks, and it's going to be
// tied to the listen function in the server.
//-------------------------------------------------------------------------------
router.findAndExecuteRoutes = (request, response) => {
  logger.log(logger.INFO, 'Routing a Request');
  return requestParser.parseAsync(request)
    .then((parsedRequest) => {
      logger.log(logger.INFO, `url ${parsedRequest.method}`);

      const handler = routeHandlers[parsedRequest.method][parsedRequest.url.pathname];
      logger.log(logger.INFO, 'Found the following handler');
      // logger.log(logger.INFO, handler.toString());

      if (handler) {
        return handler(parsedRequest, response);
      }
      response.writeHead(404);
      response.end();
      return undefined;
    }).catch((error) => {
      logger.log(logger.INFO, 'Responding back with 400 status code');
      console.log(error);
      response.writeHead(400, { 'Content-Type': 'text/plain' });
      response.write('Bad Request');
      response.end();
      return undefined;
    });
};
