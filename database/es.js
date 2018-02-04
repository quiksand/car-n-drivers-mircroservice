const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  host: 'localhost:9200'
});

// const getDriverById = (driverId) => {
//   return new Promise((resolve, reject) => {
//     client.get({
//       index: 'drivers',
//       type: 'driver',
//       id: driverId
//     }, (error, response) => {
//       if (error) {
//         // console.log("ES Error");
//         reject(error);
//       }
//       else {
//         resolve(response._source);
//       }
//     });
//   });
// };

const getDriverById = async (driverId) => {
    return client.get({
      index: 'drivers',
      type: 'driver',
      id: driverId
    })
    // , (error, response) => {
    //   if (error) {
    //     return error
    //   }
    //   else {
    //     return response._source;
    //   }
    // });
};

module.exports = {
  client: client,
  getDriverById: getDriverById
};