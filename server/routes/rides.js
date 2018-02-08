const { db, cache } = require('../../database');
const { driverComms, rideService } = require('../../lib');

const requestRide = async ctx => {
  //find nearby drivers
  try {
    let p_lat = ctx.request.body.lat.toString();
    let p_lng = ctx.request.body.lng.toString();
    let p_zip = ctx.request.body.zip;
    let dest_lat = ctx.request.body.dest_lat.toString();
    let dest_lng = ctx.request.body.dest_lng.toString();
    let dest_zip = ctx.request.body.dest_zip;
    let drivers = await cache.findDriversWithin(p_lat, p_lng, 1000);
    //poll these drivers if they exist, else return nah, not today, sorry
    let driverId = await driverComms.pollDrivers(drivers);
    //lookup driver info
    let lookup = await db.getDriverById(driverId);
    let driverInfo = {
      driver_id: driverId,
      name_first: lookup._source.name_first,
      license_plate: lookup._source.license_plate,
      driver_phone: lookup._source.phone,
      car_make: lookup._source.car_make,
      car_model: lookup._source.car_model,
      car_year: lookup._source.car_year
    };
    //return driver info to requester
    //send driver to 'ride service'
    rideService.assignDriver(lookup._source, dest_lat, dest_lng, dest_zip);
    ctx.body = driverInfo;
    ctx.status = 200;
  }
  catch (err) {
    ctx.status = 500;
  }
};

module.exports = {
  requestRide: requestRide
};
