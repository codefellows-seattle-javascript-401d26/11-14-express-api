'use strict';


const faker = require('faker');

const superagent = require('superagent');

const server = require('../src/lib/server');

const seattleBarMock = require('./lib/seattlebar-mock');


const API_URL = `http://localhost:${process.env.PORT}/api/seattlebar`;

describe('/api/seattlebar', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  // beforeEach(seattleBarMock.pCreateSeattleBarMock);
  afterEach(seattleBarMock.pCleanSeattleBarMock);

  // POST------------------------- Success Test ----------
  test('should respond with 200 status code and a new json note', () => {
    const originalRequest = {
      title: faker.lorem.words(2),
      content: faker.lorem.words(1),
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
  // POST ------------------ fail, no content---------------------//
  test('should respond with 400 status code if there is no content', () => {
    const originalRequest = {
      content: faker.lorem.words(1),
    };
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send(originalRequest)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });

  // POST ---------------fail no title ---------------------------
  test('should respond with 400 status code if there is no title', () => {
    const originalRequest = {
      title: faker.lorem.words(1),
    };
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send(originalRequest)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  // GET-----------------------success matching id-------------------
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
  // get----------------- fail no bar found -----------------------
  test('should respond with 404 for no bar found', () => {
    return superagent.get(`${API_URL}`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });

  //   // DELETE ------------------Success bar removed -------------
  test('should respond with 200 if we remove bar', () => {
    return seattleBarMock.pCreateSeattleBarMock()
      .then((createdSeattleBarMock) => {
        return superagent.delete(`${API_URL}/${createdSeattleBarMock._id}`);
      })
      .then((deleteResponse) => {
        expect(deleteResponse.status).toEqual(204);
      });
  });

  // DELETE ------------- fail no id match ------------------
  test('should respond with 404 if id is not matching', () => {
    return superagent.delete(`${API_URL}/ahngsgdhgs`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });
});
//   // put--------------------success on update on title and content ---------
//
//   test('should 200 respond with an updated title and content were updated', () => {
//     let savedSeattleBarMock = null;
//     return seattleBarMock.pCreateSeattleBarMock()
//       .then((createSeattleBarMock) => {
//         savedSeattleBarMock = createSeattleBarMock;
//         const newPut = {
//           title: faker.lorem.words(1),
//           content: faker.lorem.words(1),
//         };
//         return superagent.put(`${API_URL}/${createSeattleBarMock._id}`)
//           .send(newPut)
//           .then((putResponse) => {
//             expect(putResponse.status).toEqual(200);
//             expect(putResponse.body._id).toEqual(savedSeattleBarMock.id);
//             expect(putResponse.body.content).toEqual(newPut.content);
//
//            expect(putResponse.body.title).toEqual(newPut.title);
//           });
//       });
//   });
//   // PUT---------------fail no id match -----------------
//   test('should respond with 404, if there is not a matching id to update', () => {
//     return superagent.put(`${API_URL}/09019384`)
//       .then(Promise.reject)
//       .catch((response) => {
//         expect(response.status).toEqual(400);
//       });
//   });
// });
