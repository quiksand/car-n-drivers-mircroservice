

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

module.exports = {
  info: info,
  lat: lat,
  lng: lng,
  zip: zip
}