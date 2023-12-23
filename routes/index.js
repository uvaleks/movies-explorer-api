const { Router } = require('express');
const NotFoundError = require('../errors/not-found-error');
const userRouter = require('./users');
const movieRouter = require('./movies');

const router = Router();

router.use('/users/me', userRouter);
router.use('/movies', movieRouter);

router.use((req, res, next) => {
  const err = new NotFoundError('Неправильный путь');
  next(err);
});

module.exports = router;
