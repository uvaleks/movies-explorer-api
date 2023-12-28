const { Router } = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  login,
  logout,
  createUser,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-error');
const userRouter = require('./users');
const movieRouter = require('./movies');

const router = Router();

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

router.post('/signout', logout);

router.use(auth);

router.use('/users/me', userRouter);
router.use('/movies', movieRouter);

router.use((req, res, next) => {
  const err = new NotFoundError('Неправильный путь');
  next(err);
});

module.exports = router;
