const dataStore = require('../../database');
const db = dataStore.db;
const cache = dataStore.cache;

const login = async ctx => {
  try {
    let driver = await db.getDriverById(ctx.request.body.driverId);
    //this is probably where you'd do some auth, if you were so inclined :P
    //but nah, we're pretty trusting here at Car'n
    cache.activateDriver(driver._source);
    ctx.status = 200;
  } catch(err) {
    ctx.status = 404;
  }
};

const logout = async ctx => {
  try {
    let driver = await db.getDriverById(ctx.request.body.driverId);
    cache.deactivateDriver(ctx.request.body.driverId);
    ctx.status = 200;
  } catch (err) {
    ctx.status = 404;
  }
};

module.exports = {
  login: login,
  logout: logout
};