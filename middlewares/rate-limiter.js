const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
  windowMs: 1000,
  limit: 1,
});
