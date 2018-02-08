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

describe('routes: /drivers/login', () => {

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

describe('routes: /drivers/logout', () => {
  
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

describe('routes: /request', () => {
  
  it('should return 200 when passed a request and there is a driver in the area', done => {
    chai.request(app)
      .post('/request').send({
        lat: 37.80072,
        lng: -122.45656,
        zip: 94123,
        dest_lat: 37.774929,
        dest_lng: -122.419416,
        dest_zip: 94117
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should return 500 when there\'s an error', done => {
    let id = 'this-isnot-areal-idstring';
    chai.request(app)
      .post('/request').send({
        blarg: 'This is not the JSON you\'re looking for'
      })
      .end((err, res) => {
        expect(err).to.exist;
        expect(res).to.have.status(500);
        done();
      });
  });

  it('should remove the driver from the active driver pool upon request', done => {
    chai.request(app)
      .post('/request').send({
        lat: 37.80072,
        lng: -122.45656,
        zip: 94123,
        dest_lat: 37.774929,
        dest_lng: -122.419416,
        dest_zip: 94117
      })
      .end((err, res) => {
        let driverId1 = res.body.driver_id;
        chai.request(app)
          .post('/request').send({
            lat: 37.80072,
            lng: -122.45656,
            zip: 94123,
            dest_lat: 37.774929,
            dest_lng: -122.419416,
            dest_zip: 94117
          })
          .end((err, res) => {
            let driverId2 = res.body.driver_id;
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(driverId1).to.not.equal(driverId2);
            done();
          });
      });
  });

  it('should return the driver\'s info if a ride is found', done => {
    chai.request(app)
      .post('/request').send({
        lat: 37.80072,
        lng: -122.45656,
        zip: 94123,
        dest_lat: 37.774929,
        dest_lng: -122.419416,
        dest_zip: 94117
      })
      .end((err, res) => {
        expect(res.body.driver_id).to.exist;
        expect(res.body.name_first).to.exist;
        expect(res.body.license_plate).to.exist;
        expect(res.body.driver_phone).to.exist;
        expect(res.body.car_make).to.exist;
        expect(res.body.car_model).to.exist;
        expect(res.body.car_year).to.exist;
        done();
      });
  });

  it('should return 500 when there is no driver in a 1km radius', done => {
    chai.request(app)
      .post('/request').send({
        lat: -37.80072,
        lng: 122.45656,
        zip: 00000,
        dest_lat: 37.774929,
        dest_lng: -122.419416,
        dest_zip: 94117
      })
      .end((err, res) => {
        expect(err).to.exist;
        expect(res).to.have.status(500);
        done();
      });
  });

});

describe('routes: /drivers/track', () => {

  before(done => {
    chai.request(app)
      .post('/drivers/login').send({
        driverId: '0b23cab7-72a0-4ea2-a0d7-1914696db891'
      })
      .end((err, res) => {
        done();
      });
  });

  it('should update the driver\'s location in the cache', done => {
    let id = helpers.getRandomDriverId();
      chai.request(app)
      .post('/drivers/track').send({
        driverId: '0b23cab7-72a0-4ea2-a0d7-1914696db891',
        lat: -37.80072,
        lng: 122.45656,
        zip: 00000,
      })
      .end((err, res) => {
        cache.client.geopos(cacheKey.geocoords, cacheKey.geo(res.body.driver_id), (err, resp) => {
          console.log(resp);
          chai.request(app)
            .post('/drivers/track').send({
              id: '0b23cab7-72a0-4ea2-a0d7-1914696db891',
              lat: 37.80072,
              lng: -122.45656,
              zip: 94117,
            })
            .end((err, res) => {
              cache.client.geopos(cacheKey.geocoords, cacheKey.geo(res.body.driver_id), (err, resp) => {
                console.log(resp)
                done();
              });
            });
        })
      });
  });

});
// '/drivers/track'