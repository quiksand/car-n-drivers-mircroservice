const axios = require('axios');

const findDriver = (listOfCloseDriverIds) => {
  //in reality, we'd ping all the drivers but Car'n is currently out of drivers
  return listOfCloseDriverIds[Math.floor(Math.random * listOfCloseDriverIds.length)];
};

const confirmDriver = async (driverId) => {
  return 'yeah ok we totally told him to pick you up or whatever';
};

const getDriverResponse = async () => {
  //they would say yes or no, but really they'll just always say yes
  //axios magic await the response but we'll be lazy and assume they want the ride
  return true;
};

const pollDrivers = async (listOfCloseDriverIds) => {
  for (let i = 0; i < listOfCloseDriverIds.length; i++) {

  }
};

module.exports = {
  findDriver: findDriver
};