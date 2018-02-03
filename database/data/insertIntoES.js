let t0 = Date.now();
const progress = require('progress-barzz');
const fs = require('fs');
const readline = require('readline');
const elasticsearch = require('elasticsearch');

const log = console.log;
let hideLog = bool => {
  console.log = bool ? () => {} : log;
};

const fname = './database/data/driverData/driverDataMore.txt';
const reader = readline.createInterface(fs.createReadStream(fname));
const client = new elasticsearch.Client({
  host: 'localhost:9200'
});

//{"id":"421a6057-c321-40ad-bab1-3361c8c77931","name_first":"Mathew","name_last":"Beer","password":"d854373860","dl_number":"W2404984","email":"Gustave61@yahoo.com","phone":"763.916.3726 x75339","license_plate":"2FPU380","car_make":"McLaren","car_model":"MP4-12C","car_year":2014,"address_city":"San Jose","address_state":"CA","address_zip":"94102","last_zip":"94102","last_lat":37.783783,"last_lng":-122.4114007},

client.indices.putMapping({
  index: "drivers",
  type: "driver",
  body: {
    properties: {
      "id": {
        "type": "text"
      },
      "name_first": {
        "type": "text",
        "index": false
      },
      "name_last": {
        "type": "text",
        "index": false
      },
      "password": {
        "type": "text",
        "index": false
      },
      "dl_number": {
        "type": "text",
        "index": false
      },
      "email": {
        "type": "text",
        "index": false
      },
      "phone": {
        "type": "text",
        "index": false
      },
      "license_plate": {
        "type": "text",
        "index": false
      },
      "car_make": {
        "type": "text",
        "index": false
      },
      "car_model": {
        "type": "text",
        "index": false
      },
      "car_year": {
        "type": "integer",
        "index": false
      },
      "address_city": {
        "type": "text",
        "index": false
      },
      "address_state": {
        "type": "text",
        "index": false
      },
      "address_zip": {
        "type": "text",
        "index": false
      },
      "last_zip": {
        "type": "text",
        "index": false
      },
      "last_lat": {
        "type": "float",
        "index": false
      },
      "last_lng": {
        "type": "float",
        "index": false
      }
    }
  }
}, function (err, resp, status) {
  if (err) {
    console.log(err);
  }
  else {
    console.log(resp);
  }
});



let total = 0;
let numberToInsert = 50000;
let waitTime = 5000;
let toInsert = [];
progress.init(10000000 / numberToInsert);
console.log(`Est. ${((10000000 / numberToInsert) * (waitTime / 1000) / 60).toFixed(1)} minutes`)

let cleanup = () => {
  // clear array
  toInsert = [];
  // tick incrementer
  let t1 = Date.now();
  while (Date.now() - t1 < waitTime) { }
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(progress.tick());
  // resume reading from file
  reader.resume();
  // setTimeout(reader.resume, 5000);
}

reader.on('line', line => {
  let json = JSON.parse(line);
  toInsert.push({ index: { _index: 'drivers', _type: 'driver', _id: json.id } });
  toInsert.push(json);
  total++;
  if (toInsert.length === 2 * numberToInsert) {
    reader.pause();
  }
});

reader.on('pause', () => {
  // console.log(process.memoryUsage().heapUsed / 1048576)
  // insert into db
  client.bulk({ body: toInsert }, (err, resp) => {
    if (err) { 
      // console.log(err) 
      // reader.pause();
      process.exit();      
    }
  });
  cleanup();
  // // clear array
  // toInsert = [];
  // // tick incrementer
  // let t1 = Date.now();  
  // while (Date.now() - t1 < waitTime) {}
  // readline.cursorTo(process.stdout, 0);
  // process.stdout.write(progress.tick()); 
  // // resume reading from file
  // reader.resume();
  // // setTimeout(reader.resume, 5000);
});

reader.on('close', () => {
  if (toInsert.length > 0) {
    client.bulk({ body: toInsert }, (err, resp) => {
      if (err) {
        // console.log(err)
        // reader.pause();
        process.exit();
      }
    });
    cleanup();
  }
  console.log(`wrote ${total} lines from ${fname} to ES in ${((Date.now() - t0) / 60000).toFixed(1)} minutes`);
});

