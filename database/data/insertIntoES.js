const { performance } = require('perf_hooks');
const esClient = require('../');
let t0 = performance.now();
let data = [];
for (let i = 0; i < 100; i++) {
  var a = require(`./driverData/drivers-${i}.json`);
  console.log(i)
  console.log(process.memoryUsage().heapUsed)  
  delete a;
  console.log(process.memoryUsage().heapUsed)
}
console.log(performance.now() - t0);