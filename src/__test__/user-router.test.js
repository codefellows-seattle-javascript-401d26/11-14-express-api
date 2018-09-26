'use strict';

// development note: - jest server needs this to be statically declared here
process.env.PORT = 4000;
const API_PORT = process.env.PORT;

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server');

describe('testing app.js routes and responses.', () => {
  beforeAll(server.start);
  afterAll(server.stop);

  test('should respond 200 and return a new user in json.', () => {
    return superagent.post(`http://localhost:${API_PORT}/new/user`)
      .set('Content-Type', 'application/json')
      .send({
        username: 'bgwest88',
        title: 'Sysadmin / Junior Developer',
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.username).toEqual('bgwest88');
        expect(response.body.title).toEqual('Sysadmin / Junior Developer');

        expect(response.body.timestamp).toBeTruthy();
        expect(response.body.id).toBeTruthy();
      });
  });
  test('should respond 400 if there is no job role title.', () => {
    return superagent.post(`http://localhost:${API_PORT}/new/user`)
      .set('Content-Type', 'application/json')
      .send({
        username: 'bgwest',
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  test('should respond with 200 status code and a json note if there is a matching id.', () => {
    const originalRequest = {
      username: faker.lorem.words(5),
      title: faker.lorem.words(5),
    };
    return superagent.post(`http://localhost:${API_PORT}/new/user`)
      .set('Content-Type', 'application/json')
      .send(originalRequest)
      .then((postResponse) => {
        // development note: If you see this code at work, propose the use of MOCK OBJECTS...
        originalRequest.id = postResponse.body.id;
        return superagent.get(`http://localhost:${API_PORT}/login/${postResponse.body.id}`);
      })
      .then((getResponse) => {
        expect(getResponse.status).toEqual(200);
        expect(getResponse.body.timestamp).toBeTruthy();
        expect(getResponse.body.id).toEqual(originalRequest.id);
        expect(getResponse.body.title).toEqual(originalRequest.title);
      });
  });
  test('should respond 204 if a user is removed', () => {
    const ogRequest = {
      username: faker.lorem.words(5),
      title: faker.lorem.words(5),
    };
    return superagent.post(`http://localhost:${API_PORT}/new/user`)
      .set('Content-Type', 'application/json')
      .send(ogRequest)
      .then((postResponse) => {
        ogRequest.id = postResponse.body.id;
        return superagent.delete(`http://localhost:${API_PORT}/login/${ogRequest.id}`);
      })
      .then((getResponse) => {
        expect(getResponse.status).toEqual(204);
      });
  });
  test('should respond 404 if user does not exist on delete request.', () => {
    return superagent.delete(`http://localhost:${API_PORT}/login/hooo-boy-this-id-invalid`)
      .then(Promise.reject)
      .catch((getResponse) => {
        expect(getResponse.status).toEqual(404);
      });
  });
  test('if username update for user is successful, should respond 204', () => {
    const ogRequest = {
      username: faker.lorem.words(5),
      title: faker.lorem.words(5),
    };
    return superagent.post(`http://localhost:${API_PORT}/new/user`)
      .set('Content-Type', 'application/json')
      .send(ogRequest)
      .then((postResponse) => {
        ogRequest.id = postResponse.body.id;
        return superagent.put(`http://localhost:${API_PORT}/login/${ogRequest.id}`)
          .send({
            username: 'mrtrey',
          });
      })
      .then((putResponse) => {
        expect(putResponse.status).toEqual(200);
        expect(putResponse.body.id).toEqual(ogRequest.id);
        expect(putResponse.body.username).toEqual('mrtrey');
        expect(putResponse.body.content).toEqual(ogRequest.content);
      });
  });
});
