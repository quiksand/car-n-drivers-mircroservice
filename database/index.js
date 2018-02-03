const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

const getDriverById = (DriverId) => {
  return new Promise((resolve, reject) => {
    client.get({
      index: 'drivers',
      type: 'driver',
      id: DriverId
    }, (error, response) => {
      if (error) {
        reject(error)
      }
      else {
        resolve(response._source)
      }
    })
  })
};

module.exports = {
  esClient: client,
  getDriverById: getDriverById
}