
const info = id => {
  return `info:${id}`;
};

const lat = id => {
  return `lat:${id}`;
};

const lng = id => {
  return `lng:${id}`;
};

const geo = id => {
  return `geo:${id}`;
};

const zip = id => {
  return `zip:${id}`;
};

const zipCode = zip => {
  return `zipCode:${zip}`;
};

const strip = s => {
  return key => {
    if (key.indexOf(s) !== -1) {
      return key.slice(s.length + 1);
    } else {
      return key;
    }
  };
};

const un = {
  info: strip('info'),
  lat: strip('lat'),
  lng: strip('lng'),
  geo: strip('geo'),
  zip: strip('zip'),
  zipCode: strip('zipCode')
};

const geocoords = 'driver_locations';

module.exports = {
  info: info,
  lat: lat,
  lng: lng,
  zip: zip,
  zipCode: zipCode,
  geo: geo,
  geocoords: geocoords,
  un: un
};