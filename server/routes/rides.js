

const requestRide = async (ctx, next) => {
  console.log('TODO: Ride Request Function')
  ctx.body = 'ride request successful'
  ctx.status = 201;
}

const match = async (ctx, next) => {
  console.log('TODO: Ride Request Function')
  ctx.body = 'ride request successful'
  ctx.status = 201;
}

module.exports = {
  requestRide: requestRide,
  match: match
};