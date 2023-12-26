const express = require('express');
const { json } = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { celebrate, Joi, errors } = require('celebrate');
const {
  login,
  logout,
  createUser,
} = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const auth = require('./middlewares/auth');
const router = require('./routes');

const app = express();

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb-dev' } = process.env;

mongoose.connect(MONGO_URL);

app.use(json());

app.use(requestLogger);

app.use(cors);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

app.post('/signout', logout);

app.use(auth);

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
