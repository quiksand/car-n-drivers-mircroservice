process.env.NODE_ENV = 'test';
let mocha = require('mocha');
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
