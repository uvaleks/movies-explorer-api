const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const ConflictError = require('../errors/conflict-error');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const user = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUser = (req, res, next) => {
  const { _id } = req.user;
  user.findOne({ _id })
    .then((foundUser) => {
      if (!foundUser) {
        throw new NotFoundError('Пользователь по id не найден');
      }
      res.status(200).send(foundUser);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      req.body.password = hash;
      return user.create(req.body);
    })
    .then((createdUser) => {
      const { email } = createdUser;
      return user.findOne({ email });
    })
    .then((foundUser) => res.status(201).send(foundUser))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь уже существует'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  user.findOne({ email }).select('+password')
    .then((foundUser) => {
      if (!foundUser) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, foundUser.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }

          const token = jwt.sign(
            { _id: foundUser._id.toString() },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
          );

          res.setHeader('Set-Cookie', cookie.serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
          }));

          return res.status(200).send({ message: 'Всё верно!', _id: foundUser._id });
        });
    })
    .catch(next);
};

const logout = (req, res, next) => {
  res.setHeader('Set-Cookie', cookie.serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  }));
  return res.status(200).send({ message: 'Вы успешно вышли из системы' })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const update = req.body;
  user.findById(req.user._id)
    .then((foundUser) => {
      if (!foundUser) {
        throw new NotFoundError('Пользователь по id не найден');
      }
      const updatedFields = {};
      if (update.email) {
        updatedFields.email = update.email;
      }
      if (update.name) {
        updatedFields.name = update.name;
      }
      return user.findByIdAndUpdate(
        req.user._id,
        updatedFields,
        { new: true, runValidators: true },
      );
    })
    .then((savedUser) => {
      res.status(200).send(savedUser);
    })
    .catch(next);
};

module.exports = {
  login,
  logout,
  createUser,
  getUser,
  updateProfile,
};
