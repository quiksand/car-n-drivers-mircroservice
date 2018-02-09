const cache = require('../../database').cache;

const updateLocation = async ctx => {
  cache.trackDriver(
    ctx.request.body.driverId,
    ctx.request.body.lat,
    ctx.request.body.lng,
    ctx.request.body.zip,
  );
  ctx.status = 204;
}

module.exports = {
  updateLocation: updateLocation
}