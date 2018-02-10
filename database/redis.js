const { promisify } = require('util');
const key = require('./redis-keys');
const redis = require('redis');
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const geopos = promisify(client.geopos).bind(client);
const georadius = promisify(client.georadius).bind(client);
const getKeysAsync = promisify(client.keys).bind(client);
const mgetAsync = promisify(client.mget).bind(client);

client.on('error', (err) => {
  console.log(err);
});

const activateDriver = async (driverInfo) => {
  client.set(key.info(driverInfo.id), JSON.stringify(driverInfo));
  client.set(key.zip(driverInfo.id), driverInfo.last_zip);
  client.geoadd(key.geocoords, `${driverInfo.last_lng}`, `${driverInfo.last_lat}`, key.geo(driverInfo.id));
  client.incr(key.zipCode(driverInfo.last_zip));
  return true;
};

const deactivateDriver = async driverId => {
  //remove a driver from the redis cache
  let zip = await getAsync(key.zip(driverId));
  client.decr(key.zipCode(zip));
  client.del(key.info(driverId));
  client.del(key.zip(driverId));
  client.zrem(key.geocoords, key.geo(driverId));
};

const trackDriver = async (driverId, lat, lng, zip) => {
  //update a driver's location in the cache
  let oldZip = await getAsync(key.zip(driverId));
  client.geoadd(key.geocoords, `${lng}`, `${lat}`, key.geo(driverId));
  client.set(key.zip(driverId), zip);
  client.decr(key.zipCode(oldZip));  
  client.incr(key.zipCode(zip));  
};

const countDriversInZip = async () => {
  //get all the drivers in all the zips in all the cache
  let results = {};
  let allZips = await getKeysAsync(key.zipCode('*'));
  for (let i = 0; i < allZips.length; i++) {
    let count = await getAsync(allZips[i]);
    results[key.un.zipCode(allZips[i])] = count;
  }
  return results;
};

const findDriversWithin = async (lat, lng, r) => {
  //return a list of the nearest drivers in a given radius, sorted closest to furthest
  let drivers = await georadius(
      key.geocoords,
      `${lng}`,
      `${lat}`,
      r, 'm',
      'WITHCOORD',
      'WITHDIST'
      );
  let results = [];
  for (let i = 0; i < drivers.length; i++) {
    results.push(drivers[i][0].slice(4)); //get rig of 'geo:'
  }
  return results;
};

const getDriverLocation = async driverId => {
  //get a driver's location and zip
  let zip = await getAsync(key.zip(driverId));
  let lnglat = await geopos(key.geocoords, key.geo(driverId));
  return { last_zip: zip, last_lat: lnglat[0][1], last_lng: lnglat[0][0] };
};

const deleteCache = async () => {
  let keys = await getKeysAsync('*');
  console.log(keys.length + ' keys will be deleted')
  for (let k = 0; k < keys.length; k++) {
    console.log(`${100 * k / keys.length}%`);
    client.del(keys[k]);
  }
  process.exit();
};

module.exports = {
  client: client,
  activateDriver: activateDriver,
  deactivateDriver: deactivateDriver,
  countDriversInZip: countDriversInZip,
  trackDriver: trackDriver,
  getDriverLocation: getDriverLocation,
  findDriversWithin: findDriversWithin,
  deleteCache: deleteCache
}