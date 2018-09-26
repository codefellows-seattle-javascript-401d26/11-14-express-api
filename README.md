# 11: Express - app.js
##### restful HTTP server built with express
[![Build Status](https://travis-ci.com/bgwest/11-14-express-api.svg?branch=master)](https://travis-ci.com/bgwest/11-14-express-api)
## Current Features

These methods currently exist for creating, changing, deleting, and getting user data. Updates to this API will continue to stream in as this project moves forward. Currently I am part 12 of 14. 
* PUT
* DELETE
* POST
* GET

Utilizes:
* express
* middleware e.g. body-parser

## How To

#####Example uses:
```
npm run start-server
````

[x] adding a new user:

```
[0]Benjamins-MacBook-Pro:11-14-express-api bwest$ echo '{"username":"bgwest88","title":"Sysadmin / Junior Developer"}' | http :4000/new/user
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 144
Content-Type: application/json; charset=utf-8
Date: Tue, 25 Sep 2018 06:54:34 GMT
ETag: W/"90-LLpHzRldFPFhSRrXm3vrZQTYo1A"
X-Powered-By: Express

{
    "id": "dc490770-c08f-11e8-b135-53ec14e4e3ad",
    "timestamp": "2018-09-25T06:54:34.343Z",
    "title": "Sysadmin / Junior Developer",
    "username": "bgwest88"
}

[0]Benjamins-MacBook-Pro:11-14-express-api bwest$ 

```

[x] Get (login) as user:

```

[0]Benjamins-MacBook-Pro:11-14-express-api bwest$ http :4000/login/dc490770-c08f-11e8-b135-53ec14e4e3ad
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 144
Content-Type: application/json; charset=utf-8
Date: Tue, 25 Sep 2018 06:54:50 GMT
ETag: W/"90-LLpHzRldFPFhSRrXm3vrZQTYo1A"
X-Powered-By: Express

{
    "id": "dc490770-c08f-11e8-b135-53ec14e4e3ad",
    "timestamp": "2018-09-25T06:54:34.343Z",
    "title": "Sysadmin / Junior Developer",
    "username": "bgwest88"
}

[0]Benjamins-MacBook-Pro:11-14-express-api bwest$ 

```

[x] DELETE user(s)

```

[0]Benjamins-MacBook-Pro:11-14-express-api bwest$ 
[0]Benjamins-MacBook-Pro:11-14-express-api bwest$ http DELETE :4000/login/dc490770-c08f-11e8-b135-53ec14e4e3ad
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 16
Content-Type: application/json; charset=utf-8
Date: Tue, 25 Sep 2018 06:54:59 GMT
ETag: W/"10-NvZpOWfE+ZpvRWHKpNnxdbE9my4"
X-Powered-By: Express

{
    "level": "info"
}

[0]Benjamins-MacBook-Pro:11-14-express-api bwest$ http DELETE :4000/login/dc490770-c08f-11e8-b135-53ec14e4e3ad
HTTP/1.1 404 Not Found
Connection: keep-alive
Content-Length: 16
Content-Type: application/json; charset=utf-8
Date: Tue, 25 Sep 2018 06:55:03 GMT
ETag: W/"10-NvZpOWfE+ZpvRWHKpNnxdbE9my4"
X-Powered-By: Express

{
    "level": "info"
}

[0]Benjamins-MacBook-Pro:11-14-express-api bwest$

```

note the second time level: info was returned again because user was deleted.

output from server log:

```

info: DELETE - /login/([$id])
info: Attempting delete on: dc490770-c08f-11e8-b135-53ec14e4e3ad
info: current user list:
{ 'dc490770-c08f-11e8-b135-53ec14e4e3ad':
   User {
     id: 'dc490770-c08f-11e8-b135-53ec14e4e3ad',
     timestamp: 2018-09-25T06:54:34.343Z,
     username: 'bgwest88',
     title: 'Sysadmin / Junior Developer' },
  level: 'info',
  [Symbol(level)]: 'info',
  [Symbol(message)]:
   '{"dc490770-c08f-11e8-b135-53ec14e4e3ad":{"id":"dc490770-c08f-11e8-b135-53ec14e4e3ad","timestamp":"2018-09-25T06:54:34.343Z","username":"bgwest88","title":"Sysadmin / Junior Developer"},"level":"info"}' }
info: 200 - user removed.
info: DELETE - /login/([$id])
info: Attempting delete on: dc490770-c08f-11e8-b135-53ec14e4e3ad
info: 404 - User was not found.

```

[x] PUT (update) user

```

[0]Benjamins-MacBook-Pro:Repositories bwest$ 
[0]Benjamins-MacBook-Pro:Repositories bwest$ echo '{"username":"ello"}' | http PUT :4000/login/0a390800-c159-11e8-b994-67f2fbd1d839
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 140
Content-Type: application/json; charset=utf-8
Date: Wed, 26 Sep 2018 06:54:59 GMT
ETag: W/"8c-aiPTqI4hIIvWjj2c6jUB1A3fRNk"
X-Powered-By: Express

{
    "id": "0a390800-c159-11e8-b994-67f2fbd1d839",
    "timestamp": "2018-09-26T06:54:40.257Z",
    "title": "Sysadmin / Junior Developer",
    "username": "ello"
}

[0]Benjamins-MacBook-Pro:Repositories bwest$

```

### Tests Performed with Jest

* test 1: create user - should respond 200 and return a new user in json

* test 2: create user incorrectly - should respond 400 if there is no job role title

* test 3: create random user - should respond with 200 status code and a json note if there is a matching id

* test4: user removal - should respond 204 if a user is removed

* test5: delete request - should respond 404 if user does not exist

* test6: username update - if successful, should respond 204


### Installing

To use this in your code:

- git clone repo 
- npm install 
- require('../src/app.js')

## Built With

* es6
* NodeJS (fs, dotenv, express, http-errors)
* body-parser
* winston
* Eslint
* jest
* faker
* superagent
* uuid

See package.json for dependency details.

## Contributing

Please feel free to contribute. Master branch auto merge locked for approval for non-contributors.

## Versioning

*n/a*

## Authors

![CF](http://i.imgur.com/7v5ASc8.png) **Benjamin West** 

## License

*none*
