let es = require('../database/es.js');
let testIds = [
  "79caa536-fdab-4eb0-a69e-d0a1602c3669",
  "748c6032-be17-473e-b488-bba2b443fe01",
  "775d7223-ff95-4294-b6be-7e33b90695bd",
  "9ae7a88f-2e72-4cd3-9261-794c08344858",
  "b907eafd-7a1c-45dc-887c-f3bcb6335374",
  "6721bc56-34e6-46f0-be42-262717309594",
  "95d527e1-0d30-43c7-8b2a-7192d0f53fd9",
  "e0e674c0-640a-473b-a6e4-c86c10d325a9",
  "8c729106-9ba2-44a9-816b-5a6a2720b3b3",
  "cbbf9fcc-8110-4fc3-a560-0fa7bee6b07e"
];
const test = async () => {
  for (let id = 0; id < testIds.length; id++) {
    let t0 = Date.now();
    let driverInfo = await es.getDriverById(testIds[id]);
    let t1 = Date.now();
    console.log(`es.getDriverById(${testIds[id]}) - Query lookup time: ${t1 - t0}ms`)
  }
};
test();