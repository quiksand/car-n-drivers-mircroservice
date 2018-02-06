//when run, this file will create 10,000 lines of ids in json and csv format
const fs = require('fs');
const readline = require('readline');

const inFile = './database/data/driverData/driverData.txt';
const outFile = './test/data/payload.csv'

const reader = readline.createInterface(fs.createReadStream(inFile));
const writer = fs.createWriteStream(outFile);
const numEntries = 10000;

let info = [];
let ok = true;
let lineNo = 0;
let count = 0;
let start = Math.floor(Math.random() * 1000000);
let spacing = Math.floor( Math.random() * 100);

reader.on('line', line => {
  lineNo++;
  if (lineNo >= start) {
    if ((lineNo - start) % spacing === 0) {
      count++;
      let driverInfo = JSON.parse(line);
      info.push(driverInfo);
      ok = writer.write(driverInfo.id + ',\n');
      if (count === numEntries) {
        // writer.end();
        reader.close();
      } 
      if (!ok) {
        reader.pause();
      }
    }
  }
});

writer.on('drain', () => {
  reader.resume();
});

reader.on('close', () => {
  fs.createWriteStream('./test/data/driverInfo.json').write(JSON.stringify(info));
});