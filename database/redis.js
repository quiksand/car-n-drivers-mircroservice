const key = require('./redis-keys');
const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => {
  console.log(err);
});

const activateDriver = async (driverInfo) => {
  // console.log(driverInfo)
  client.set(key.info(driverInfo.id), JSON.stringify(driverInfo));
  client.set(key.zip(driverInfo.id), driverInfo.last_zip);
  client.geoadd(key.geocoords, `${driverInfo.last_lng}`, `${driverInfo.last_lat}`, key.geo(driverInfo.id));
  // client.get(key.info(driverInfo.id), (err, res) => { console.log(res)})
  return true;
};

const deactivateDriver = async (driverId) => {
  //remove a driver from the redis cache
  client.del(key.info(driverId));
  client.del(key.zip(driverId));
  client.zrem(key.geocoords, key.geo(driverId));
};

const trackDriver = async (driverId, lat, lng, zip) => {
  //update a driver's location in the cache
  client.geoadd(key.geocoords, `${lng}`, `${lat}`, key.geo(driverId));
  client.set(key.zip(driverId), zip);
};

const countDriversInZip = async (zip) => {
  //get all the drivers in zip
};

const findDriversWithin = async (lat, lng, r) => {
  //return a list of the nearest drivers in a given radius, sorted closest to furthest
  let drivers = await new Promise((res, rej) => {
    client.georadius(
      key.geocoords, 
      `${lng}`, 
      `${lat}`, 
      r, 'm', 
      'WITHCOORD', 
      'WITHDIST', 
      (err, resp) => {
        if (err) { rej(err); }
        else { res(resp); }
      });
  });
  let results = [];
  for (let i = 0; i < drivers.length; i++) {
    results.push(drivers[i][0].slice(4)); //get rig of 'geo:'
  }
  return results;
};

const getDriverLocation = async (driverId) => {
  //get a driver's location and zip
  let zip = await new Promise((res, rej) => {
    client.get(key.zip, (err, resp) => {
      if (err) { rej(err); }
      else { res(resp); }
    });
  });
  let lnglat = await new Promise((res, rej) => {
    client.geopos(key.geocoords, key.geo(driverId), (err, resp) => {
      if (err) { rej(err); }
      else { res(resp); }
    });
  });
  console.log(zip, lnglat);  
  return {last_zip: zip, last_lat: lnglat[1], last_lng: lnglat[0]};
};

module.exports = {
  client: client,
  activateDriver: activateDriver,
  deactivateDriver: deactivateDriver,
  countDriversInZip: countDriversInZip,
  trackDriver: trackDriver,
  getDriverLocation: getDriverLocation,
  findDriversWithin: findDriversWithin
}