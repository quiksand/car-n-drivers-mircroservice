const Router = require('koa-router');
const router = new Router();
const sessions = require('./sessions');
const tracking = require('./tracking');
const rideRequests = require('./rides');

router.post('/drivers/login', sessions.login);
router.post('/drivers/logout', sessions.logout);
router.post('/request', rideRequests.requestRide);
router.post('/drivers/match', rideRequests.match)
router.put('/drivers/track', tracking.updateLocation);

module.exports = router.routes.bind(router)