process.env.NODE_ENV = 'test';
let helpers = require('./helpers');
let mocha = require('mocha');
let chai = require('chai');
let expect = chai.expect;
let chaiHttp = require('chai-http');
let app = require('../server/app.js').listen(3001);
let cacheKey = require('../database/redis-keys');
let { db, cache } = require('../database');
chai.use(chaiHttp);

describe('routes: drivers/login', () => {

  it('should return 200 when passed a valid id', done => {
    let id = helpers.getRandomDriverId();
      chai.request(app)
      .post('/drivers/login').send({
        driverId: id
      })
      .end((err, res) => {
        cache.deactivateDriver(id);
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should activate a driver when passed a valid id', done => {
    let driverInfo = helpers.getRandomDriverInfo();
    chai.request(app)
      .post('/drivers/login').send({
        driverId: driverInfo.id
      })
      .end((err, res) => {
        cache.client.get(cacheKey.info(driverInfo.id), (err, resp) => {
          expect(err).to.be.null;
          expect(JSON.parse(resp).id).to.equal(driverInfo.id);
          cache.deactivateDriver(driverInfo.id);
          done();
        });
      });
  });

  it('should return 404 when passed an invalid id', done => {
    let id = 'this-isnot-areal-idstring';
    chai.request(app)
      .post('/drivers/login').send({
        driverId: id
      })
      .end((err, res) => {
        expect(err).to.exist;
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should not activate a non-existant driver when passed an invalid id', done => {
    let id = 'this-isnot-areal-idstring';
    chai.request(app)
      .post('/drivers/login').send({
        driverId: id
      })
      .end((err, res) => {
        cache.client.get(cacheKey.info(driverInfo.id), (err, resp) => {
          expect(err).to.be.null;
          expect(resp).to.be.null;
          done();
        });
      });
  });

});

describe('routes: drivers/logout', () => {
  
  it('should return 200 when passed a valid id', done => {
    let id = helpers.getRandomDriverId();
    chai.request(app)
      .post('/drivers/login').send({
        driverId: id
      })
      .end((err, res) => {
        chai.request(app)
          .post('/drivers/logout').send({
            driverId: id
          })
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            done();
          });
      });
  });

  it('should return 404 when passed an invalid id', done => {
    let id = 'this-isnot-areal-idstring';
    chai.request(app)
      .post('/drivers/logout').send({
        driverId: id
      })
      .end((err, res) => {
        expect(err).to.exist;
        expect(res).to.have.status(404);
        done();
      });
  });

});
