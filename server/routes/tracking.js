
const updateLocation = async (ctx, next) => {
  console.log('TODO: Update Driver Location Function')
  ctx.body = 'updating driver location successful'
  ctx.status = 201;
}

module.exports = {
  updateLocation: updateLocation
}