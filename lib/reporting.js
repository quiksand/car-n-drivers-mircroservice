const axios = ('axios');
const sfZips = require('../database/data/sfZips.json');
const dataStore = require('../database');
const db = dataStore.db;
const cache = dataStore.cache;

let reportingInterval = 10000; //send the report
let reportToFaresTimer;

// const getZipByLatLng = (lat, lng) => {
//   return zipData;
// };

const getCountOfAllZipsInCache = () => {
  //we're just using SF bay aea zips for now
  let zips = {};
  for (let zip in sfZips) {
    zips[zip] = cache.countDriversInZip();
  }
  return zips;
};

const stopReportToFaresService = () => {
  clearTimeout(reportToFaresTimer);
};

const sendReportToFaresService = () => {
  let toSend = getCountOfAllZipsInCache();
  //axios post request to send fare report
  // axios.post({
  //   method: 'post',
  //   params: toSend
  // });
  console.log('sending report to Fares Service');
  reportToFaresTimer = setTimeOut(sendDriverReportToFaresService, reportingInterval);
};

reportToFaresTimer = stopReportToFaresService();

//return a reference to the timeer for the report and the start function;
module.exports = {
  reportToFaresTimer: reportToFaresTimer,
  stopReportToFaresService: stopReportToFaresService,
  sendReportToFaresService: sendReportToFaresService
}