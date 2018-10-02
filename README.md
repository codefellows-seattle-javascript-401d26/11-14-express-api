![cf](http://i.imgur.com/7v5ASc8.png) Restful API 
====
[![Build Status](https://travis-ci.com/ashabrai/11-14-express-api.svg?branch=master)]
(https://travis-ci.com/ashabrai/11-14-express-api)

This project is to build a restful api with GET, PUT, POST, DELETE data.
Along with http-error routes to respond back to the client. 

## Getting Started
   * Instructions of what has been done will allow you to get the code running on your 
   local machine. 


## Requirements  
   * You need to have NodeJS installed, so if you don't just search online for nodejs and download it.
    
#### Installing 
   * Clone the repo into your local machine -git clone -directory name here- 
   * Next install project files - npm install 
   * You will need install superagent - npm install superagent
   * A few new files will be added, error-middeware and logger-middleware.js. If an error occurs it will
   automatically reach and respond with the error code listed in the error-middleware file. The logger-middeware 
   will show you updates of whats happening in your code. You can see the log when you are doing testing 
   and its a new resource to see where errors may have a occurred. 
   * In your __test__ file you will be adding <nameoffolder>-mock.js and a test.env.js file as well. Your are going 
   to need to add your mongodb and port information for your server to run. 

#### Testing  
   * Test for valid post request
   * Test for invalid post request
   * Test for delete request 
   * Test for delete request for path not found
   * Test for post, path id found 
   * Test for post, path not found
   * Test method with query parameter
   * Don't forget to add "services:mongodb" into your .travis file, or else your test won't pass.
   * You will need to have 2 terminal windows open when you are ready to test.
   * When you are ready to test type -npm run test in one
   * And the other one run -npm run dbOn

####  Authors
* Brai Frauen 

#### License 
This project is licensed under the MIT License - see the LICENSE.md file for details

#### Version
* 1.0.3