const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
  windowMs: 10,
  limit: 1,
});
