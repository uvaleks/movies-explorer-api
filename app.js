const express = require('express');
const { json } = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
require('dotenv').config();
const helmet = require('helmet');
const { errors } = require('celebrate');
const limiter = require('./middlewares/rate-limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const router = require('./routes');

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.prod' });
} else {
  dotenv.config({ path: '.env.dev' });
}

const app = express();

app.use(helmet());
app.disable('x-powered-by');
app.use(helmet.dnsPrefetchControl());
app.use(helmet.ieNoOpen());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.hsts({ maxAge: 5184000, includeSubDomains: true, preload: true }));
app.use(helmet.noSniff());
app.use(helmet.xssFilter());

const { PORT, MONGO_URL } = process.env;

mongoose.connect(MONGO_URL);

app.use(json());

app.use(limiter);

app.use(requestLogger);

app.use(cors);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  if (err.code === 11000) {
    res.status(409).send({
      status: 409,
      message: 'Пользователь с таким email уже существует',
    });
  }
  res.status(err.statusCode || 500).send({
    status: err.statusCode,
    message: err.message,
  });
  next();
});

app.listen(PORT);

module.exports = app;
