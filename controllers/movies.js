const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const movie = require('../models/movie');

const getMovies = (req, res, next) => {
  movie.find({})
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(next);
};

const deleteMovieById = (req, res, next) => {
  const _id = req.params.movieId;
  console.log(req);
  const userId = req.user._id;
  movie.findOne({ _id })
    .then((foundMovie) => {
      if (!foundMovie) {
        throw new NotFoundError('Карточка по id не найдена');
      }
      return foundMovie;
    })
    .then((movieToDelete) => {
      const owner = movieToDelete.owner.toString();
      if (owner !== userId) {
        throw new ForbiddenError('Удаление не своих карточек запрещено');
      }
      return movie.deleteOne(movieToDelete);
    })
    .then((deletedMovie) => res.status(200).send(deletedMovie))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const movieObject = req.body;
  movieObject.owner = req.user._id;
  const newMovie = movie(movieObject);
  newMovie.save()
    .then((savedMovie) => {
      res.status(201).send(savedMovie);
    })
    .catch(next);
};

module.exports = {
  getMovies,
  deleteMovieById,
  createMovie,
};
