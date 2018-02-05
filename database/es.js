const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  host: 'localhost:9200'
});

const getDriverById = async (driverId) => {
  return client.get({
    index: 'drivers',
    type: 'driver',
    id: driverId
  });
};

module.exports = {
  client: client,
  getDriverById: getDriverById
};