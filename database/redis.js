const redis = require('redis');
const key = require('./redis-keys');
const client = redis.createClient();

client.on('error', (err) => {
  console.log(err);
});

const activateDriver = async (driverInfo) => {
  console.log(driverInfo)

  client.set(key.info(driverInfo.id), driverInfo);
  client.set(key.info(driverInfo.last_zip), 'value!', 'EX', 10000);
  client.set(key.info(driverInfo.last_lat), 'value!', 'EX', 10000);
  client.set(key.info(driverInfo.last_lng), 'value!', 'EX', 10000);
  // client.get('key', (err, reply) => {
  //   console.log(reply || err)
  // });
  return true;
};

const deactivateDriver = async (driverId) => {

};

const trackDriver = async (driverId, lat, lng) => {

};

// client.set("string key", "string val", redis.print);
// client.hset("hash key", "hashtest 1", "some value", redis.print);
// client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
// client.hkeys("hash key", function (err, replies) {
//   console.log(replies.length + " replies:");
//   replies.forEach(function (reply, i) {
//     console.log("    " + i + ": " + reply);
//   });
//   client.quit();
// });

module.exports = {
  redis: client,
  activateDriver: activateDriver,
  deactivateDriver: deactivateDriver
}