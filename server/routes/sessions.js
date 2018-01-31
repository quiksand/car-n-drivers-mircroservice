// const KoaBody = require('koa-body');

const login = async (ctx, next) => {
  console.log('TODO: Driver Login Function')
  ctx.body = 'login successful'
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