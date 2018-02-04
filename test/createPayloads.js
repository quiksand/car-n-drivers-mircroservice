const fs = require('fs');
const readline = require('readline');

const inFile = './database/data/driverData/driverData.txt';
const outFile = './test/payload.csv'

const reader = readline.createInterface(fs.createReadStream(inFile));
const writer = fs.createWriteStream(outFile);
const numEntries = 10000;

let ok = true;
let lineNo = 0;
let count = 0;
let start = Math.floor(Math.random() * 1000000);
let spacing = Math.floor( Math.random() * 100);
// const 
reader.on('line', line => {
  lineNo++;
  if (lineNo >= start) {
    if ((lineNo - start) % spacing === 0) {
      count++;
      ok = writer.write(JSON.parse(line).id + ',\n');
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

// reader.on('close', () => {
//   'calling end'
//   writer.end();
// });