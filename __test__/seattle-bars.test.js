'use strict';

process.env.PORT = 4000;

const faker = require('faker');

const superagent = require('superagent');

// const cors = require('cors');

const server = require('../src/lib/server');


const API_URL = `http://localhost:${process.env.PORT}/api/seattlebar`;

describe('/api/seattlebar', () => {
  beforeAll(server.start);
  afterAll(server.stop);

  test('should respond with 200 status code and a new json note', () => {
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send({
        title: 'Canon',
        content: 'Whiskey bar',
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.content).toEqual('Whiskey bar');
        expect(response.body.title).toEqual('Canon');
        expect(response.body.id).toBeTruthy();
      });
  });

  test('should respond with 400 status code if there is no title', () => {
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send({
        content: 'Whiskey bar',
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });

  test('should respond 200, and a json seattlebar if there is a matching id', () => {
    const originalRequest = {
      title: faker.lorem.words(5),
      content: faker.lorem.words(5),
    };
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send(originalRequest)
      .then((postResponse) => {
        originalRequest.id = postResponse.body.id;
        return superagent.get(`${API_URL}/${postResponse.body.id}`);
      })
      .then((getResponse) => {
        expect(getResponse.status).toEqual(200);
        expect(getResponse.body.id).toEqual(originalRequest.id);
        expect(getResponse.body.title).toEqual(originalRequest.title);
      });
  });

  test('should respond with 204 if we remove bar', () => {
    const originalRequest = {
      title: faker.lorem.words(5),
      content: faker.lorem.words(5),
    };
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send(originalRequest)
      .then((postResponse) => {
        originalRequest.id = postResponse.body.id;
        return superagent.delete(`${API_URL}/${postResponse.body.id}`);
      })
      .then((getResponse) => {
        expect(getResponse.status).toEqual(204);
      });
  });

  test('should respond with 404 if there is no bar to remove', () => {
    return superagent.delete(`${API_URL}/invalidId-sun-liquor`)
      .then(Promise.reject)
      .catch((getResponse) => {
        expect(getResponse.status).toEqual(404);
      });
  });

  test('should respond with 204 if we updated a bar', () => {
    const originalRequest = {
      title: faker.lorem.words(5),
      content: faker.lorem.words(5),
    };
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send(originalRequest)
      .then((postResponse) => {
        originalRequest.id = postResponse.body.id;
        return superagent.put(`${API_URL}/${postResponse.body.id}`)
          .send({
            title: 'Canon',
          });
      })
      .then((putResponse) => {
        expect(putResponse.status).toEqual(200);
        expect(putResponse.body.id).toEqual(originalRequest.id);

        expect(putResponse.body.title).toEqual('Canon');
        expect(putResponse.body.content).toEqual(originalRequest.content);
      });
  });
});
