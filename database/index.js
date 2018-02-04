const es = require('./es');
const redis = require('./redis');



module.exports = {
  db: es,
  cache: redis
}