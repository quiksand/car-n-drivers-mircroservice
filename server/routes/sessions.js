const KoaBody = require('koa-body');
const db = require('../../database');

const login = async (ctx, next) => {
  console.log('TODO: Driver Login Function')
  let driver = await db.getDriverById("0b485a72-da09-4d75-a033-412490a63774");
  console.log(driver.name_first)
  console.log(ctx.request.body);
  ctx.body = driver.name_first;
  ctx.status = 201;
}

const logout = async (ctx, next) => {
  console.log('TODO: Driver Logout Function')
  ctx.body = 'logout successful'
  ctx.status = 201;
}

module.exports = {
  login: login,
  logout: logout
}