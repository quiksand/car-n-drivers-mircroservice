const { cache } = require('./');

const del = async () => {
  await cache.deleteCache();
};

del();