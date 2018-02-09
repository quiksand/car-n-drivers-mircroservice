const sfZips = require('../../database/data/sfZips.json');
const { cache } = require('../../database');

let reportGenerationTimer;
let reportingInterval = 50000; //make a zip count report
let zipReport = {};

const generateReport = async () => {
  //we're just using SF bay aea zips for now
  zipReport = await cache.countDriversInZip();
  reportGenerationTimer = setTimeout(generateReport, reportingInterval);
};

const stopGeneratingReport = async () => {
  clearTimeout(reportGenerationTimer);
};

const sendReportToFaresService = async ctx => {
  ctx.body = zipReport;
  ctx.status = 200;
};

generateReport();

//return a reference to the timeer for the report and the start function;
module.exports = {
  reportGenerationTimer: reportGenerationTimer,
  reportingInterval: reportingInterval,
  generateReport: generateReport,
  stopGeneratingReport: stopGeneratingReport,
  sendReportToFaresService: sendReportToFaresService
}