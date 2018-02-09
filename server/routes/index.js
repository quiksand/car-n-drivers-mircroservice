const koaBody = require('koa-body');
const Router = require('koa-router');
const router = new Router();
const sessions = require('./sessions');
const tracking = require('./tracking');
const rideRequests = require('./rides');
const reporting = require('./reporting.js');

router.put('/drivers/track', koaBody(), tracking.updateLocation);
router.post('/drivers/login', koaBody(), sessions.login);
router.post('/drivers/logout', koaBody(), sessions.logout);
router.post('/requestdriver', koaBody(), rideRequests.requestRide);
router.get('/fares/data', koaBody(), reporting.sendReportToFaresService);

module.exports = router.routes.bind(router);