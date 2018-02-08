let { cache } = require('../database');

const assignDriver = async (driverInfo, newLat, newLng, newZip) => {
  //mock ride service - A driver is removed form the cache, then put pack a short while later
  //As long as we're mocking things up, let's just randomly assume each ride takes 5-30 minutes
  cache.deactivateDriver(driverInfo.id);
  let rideTime = 300000 * (Math.floor(Math.random() * 6) + 1); 
  driverInfo.last_lat = newLat;
  driverInfo.last_lng = newLng;
  driverInfo.last_zip = newZip;
  setTimeout(() => {
    cache.activateDriver(driverInfo);
  }, rideTime);
};

module.exports = {
  assignDriver: assignDriver
};