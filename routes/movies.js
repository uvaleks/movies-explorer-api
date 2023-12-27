const { Router } = require('express');
const { celebrate, Joi, errors } = require('celebrate');
const {
  getMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movies');

const movieRouter = Router();

movieRouter.get('/', getMovies);
movieRouter.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(/^(http|https):\/\/(www\.)?[\w-]+\.\w+\/?[^#\s]*/).required(),
    trailerLink: Joi.string().pattern(/^(http|https):\/\/(www\.)?[\w-]+\.\w+\/?[^#\s]*/).required(),
    thumbnail: Joi.string().pattern(/^(http|https):\/\/(www\.)?[\w-]+\.\w+\/?[^#\s]*/).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);
movieRouter.delete('/:movieId', celebrate({
  params: Joi.object({
    movieId: Joi.string().hex().length(24).required(),
  }),
}), deleteMovieById);

movieRouter.use(errors());

module.exports = movieRouter;
