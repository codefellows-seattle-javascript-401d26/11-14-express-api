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
        //! Vinicio - now I'm going send another request to get the object I just got
        //! Vinicio - I'm making a request to something that looks like this
        //!           localhost:4000/api/notes/65ba91e0-c02c-11e8-86a8-b5ee386eec53
        //! If you see this code at work, propose the use of MOCK OBJECTS
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
});
