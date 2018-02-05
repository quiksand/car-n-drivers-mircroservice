//this file will generate a 4.2GB txt file of 10M newline-delimited json objects
//run with 'npm run gendata'
const progress = require('progress-barzz');
const readline = require('readline');
const uuid = require('uuid/v4');
const faker = require('faker');
const fs = require('fs');
const cars = require('./cars.json');
const sf_zips = require('./sfZips.json');

const years = [2014, 2015, 2016, 2017, 2018];
const alphas = Array(26).fill().map((el, idx) => String.fromCharCode(idx + 65));
const digits = Array(10).fill().map((el, idx) => idx);
const cities = ['San Francisco', 'San Jose', 'Daly City', 'Cupertino', 'Palo Alto', 'Oakland', 'Berkeley', 'Fremont', 'Richmond'];

const pickOne = (collection) => {
  if (Array.isArray(collection)) {
    return collection[Math.floor(Math.random() * collection.length)]
  }
  else if (typeof collection === 'object') {
    let key = pickOne(Object.keys(collection));
    let obj = {};
    obj[key] = collection[key];
    return obj;
  }
};

const pickX = (num, arr) => {
  let rtn = [];
  for (let i = 0; i < num; i++) {
    rtn.push(pickOne(arr));
  }
  return rtn;
};

const getCar = () => {
  let json = pickOne(cars);
  return { make: json.title, model: pickOne(json.models).title, year: pickOne(years) };
};

const generateLicensePlate = () => {
  let plate = '';
  plate += Math.floor(Math.random() * 10).toString();
  plate += pickX(3, alphas).join('');
  plate += (Math.floor(Math.random() * 900) + 100).toString();
  return plate;
};

const generatePassword = () => {
  return (Math.floor(Math.random() * parseInt('0xFF5FFFFFFF', 16)) + parseInt('0xA0000000', 16)).toString(16);
};

const generateDriversLicense = () => {
  let dl = pickOne(alphas);
  dl += (Math.floor(Math.random() * 9000000) + 1000000).toString();
  return dl;
};

const getLoc = () => {
  let obj = pickOne(sf_zips);
  let zip = Object.keys(obj)[0];
  return { zip: zip, lat: obj[zip][0], lng: obj[zip][1] };
};

const createDriver = () => {
  let a = getCar();
  let b = getLoc();
  return JSON.stringify({
    id: uuid(),
    name_first: faker.name.firstName(),
    name_last: faker.name.lastName(),
    password: generatePassword(),
    dl_number: generateDriversLicense(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    license_plate: generateLicensePlate(), 
    car_make: a.make, 
    car_model: a.model, 
    car_year: a.year, 
    address_city: pickOne(cities), 
    address_state: 'CA', 
    address_zip: b.zip, 
    last_zip: b.zip, 
    last_lat: b.lat, 
    last_lng: b.lng
  });
};

progress.init(100); //initialize counter
let numToWrite = 10100000; //the number of lines to write
let fname = './database/data/driverData/driverData.txt'; //file name to write to
let stream = fs.createWriteStream(fname);
let createAndWrite = () => {
  let ok = true; //will become false when the write buffer is filled, and we need to pause until it is cleared
  while (numToWrite > 0 && ok) {
    let driver = createDriver();
    ok = stream.write(driver + '\n');
    numToWrite--;
    if (numToWrite % 100000 === 0) {//this block just writes the status to the console
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(progress.tick());
      if(numToWrite === 0) {
        console.log();
      }
    }
  }
}
stream.on('drain', createAndWrite) //restart writing once the write buffer has cleared
stream.on('close', () => {console.log('An error may have occurred in data generation')})
createAndWrite(); //begin