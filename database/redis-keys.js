

const info = (id) => {
  return `info:${id}`;
};

const lat = (id) => {
  return `lat:${id}`;
};

const lng = (id) => {
  return `lng:${id}`;
};

const geo = (id) => {
  return `geo:${id}`;
};

const zip = (id) => {
  return `zip:${id}`;
};

const geocoords = 'driver_locations';

module.exports = {
  info: info,
  lat: lat,
  lng: lng,
  zip: zip,
  geo: geo,
  geocoords: geocoords
}