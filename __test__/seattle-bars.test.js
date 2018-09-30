'use strict';


const faker = require('faker');

const superagent = require('superagent');

// const cors = require('cors');

const server = require('../src/lib/server');

const seattleBarMock = require('./lib/seattlebar-mock');


const API_URL = `http://localhost:${process.env.PORT}/api/seattleBar`;

describe('/api/seattleBar', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(seattleBarMock.pCreateSeattleBarMock);

  // POST
  test('should respond with 200 status code and a new json note', () => {
    const originalRequest = {
      title: faker.lorem.words(3),
      content: faker.lorem.words(15),
    };
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send(originalRequest)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.content).toEqual(originalRequest.content);
        expect(response.body.title).toEqual(originalRequest.title);
        expect(response.body._id.toString()).toBeTruthy();
        expect(response.body.timestamp).toBeTruthy();
      });
  });
  // POST
  test('should respond with 400 status code if there is no content', () => {
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send({
        content: 'smith tower',
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });

  // GET
  test('should respond 200, and a json seattlebar if there is a matching id', () => {
    let savedSeattleBarMock = null;
    return seattleBarMock.pCreateSeattleBarMock()
      .then((createdSeattleBarMock) => {
        savedSeattleBarMock = createdSeattleBarMock;
        return superagent.get(`${API_URL}/${createdSeattleBarMock._id}`);
      })
      .then((getResponse) => {
        expect(getResponse.status).toEqual(200);
        expect(getResponse.body.timestamp).toBeTruthy();
        expect(getResponse.body._id.toString()).toEqual(savedSeattleBarMock._id.toString());
        expect(getResponse.body.title).toEqual(savedSeattleBarMock.title);
      });
  });
  // get
  test('should respond with 404 for no bar found', () => {
    return superagent.put(`http://localhost:${process.env.PORT}/api/seattleBar/252525523`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });
});

//   // DELETE
//   test('should respond with 204 if we remove bar', () => {
//     return seattleBarMock.pCreateSeattleBarMock()
//       .then((createdSeattleBarMock) => {
//         return superagent.delete(`${API_URL}/${createdSeattleBarMock._id}`);
//       })
//       .then((getResponse) => {
//         expect(getResponse.status).toEqual(204);
//       });
//   });
//
//   // DELETE
//   test('should respond with 404 if there is no bar to remove', () => {
//     return superagent.delete(`${API_URL}/invalidId-sun-liquor`)
//       .then(Promise.reject)
//       .catch((getResponse) => {
//         expect(getResponse.status).toEqual(404);
//       });
//   });
//
//   // put
//   test('should respond with a 400 when body is not sent with request', () => {
//     return seattleBarMock.pCreateSeattleBarMock()
//       .then((createSeattleBarMock) => {
//         return superagent.put(`${API_URL}/${createSeattleBarMock._id}`)
//           .set('Content-type', 'application/json')
//           .send({})
//           .then(Promise.reject)
//           .catch((response) => {
//             expect(response.status).toEqual(undefined);
//           });
//       });
//   });
//
//   // PUT
//   test('should respond with 200 if we updated a bar content', () => {
//     let updateBar = null;
//     return seattleBarMock.pCreateSeattleBarMock()
//       .then((createSeattleBarMock) => {
//         updateBar = createSeattleBarMock;
//         return superagent.put(`${API_URL}/${createSeattleBarMock._id}`)
//           .send({
//             content: 'mai thai',
//           });
//       })
//       .then((putResponse) => {
//         expect(putResponse.status).toEqual(200);
//         expect(putResponse.body.content).toEqual('mai thai');
//         expect(putResponse.body.title).toEqual(updateBar.title);
//       });
//   });
//   test('should 200 respond with an updated title', () => {
//     let updateBar = null;
//     return seattleBarMock.pCreateSeattleBarMock()
//       .then((createSeattleBarMock) => {
//         updateBar = createSeattleBarMock;
//         return superagent.put(`${API_URL}/${createSeattleBarMock._id}`)
//           .send({
//             title: 'Stateside',
//           });
//       })
//       .then((putResponse) => {
//         expect(putResponse.status).toEqual(200);
//         expect(putResponse.body.content).toEqual(updateBar.content);
//         expect(putResponse.body.title).toEqual('Stateside');
//       });
//   });
//   // PUT
//
//   test('should respond with 404, if there is not a bar to update', () => {
//     return superagent.put(`http://localhost:${process.env.PORT}/api/seattleBar/09019384`)
//       .then(Promise.reject)
//       .catch((response) => {
//         expect(response.status).toEqual(404);
//       });
