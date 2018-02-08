const reporting = require('./reporting.js');
const driverComms = require('./driverComms.js');
const rideService = require('./mock.js');

module.exports = {
  driverComms: driverComms,
  reporting: reporting,
  rideService: rideService
};