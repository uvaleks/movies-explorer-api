const { Router } = require('express');
const { celebrate, Joi, errors } = require('celebrate');
const {
  getUser,
  updateProfile,
} = require('../controllers/users');

const userRouter = Router();

userRouter.get('/', getUser);
userRouter.patch('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    name: Joi.string().min(2).max(30),
  }),
}), updateProfile);

userRouter.use(errors());

module.exports = userRouter;
