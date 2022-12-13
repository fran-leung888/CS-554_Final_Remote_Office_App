map = {};

const SESSION_KEY = "SESSION";

module.exports = {
  SESSION_KEY,
  get: (key) => map.key,
  set: (key, value) => {
    map.key = value;
  },
};
