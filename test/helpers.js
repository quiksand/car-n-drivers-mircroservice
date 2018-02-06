const fs = require('fs');
const readline = require('readline');
let ids
try {
  driverInfo = require('./data/driverInfo.json');
} catch (err) {
  console.warn('An error occurred. Try running `npm run gentestdata`');
  process.exit();
}

const getRandomDriverInfo = () => {
  return driverInfo[Math.floor(Math.random() * driverInfo.length)];
};

const getRandomDriverId = () => {
  return driverInfo[Math.floor(Math.random() * driverInfo.length)].id;
};

const driverIdInCache = (driverID) => {

};

const removeDriverFromCache = (driverID) => {

};

module.exports = {
  getRandomDriverId: getRandomDriverId,
  getRandomDriverInfo: getRandomDriverInfo
};