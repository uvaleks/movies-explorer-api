const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: {
        value: true,
        message: 'Поле country является обязательным',
      },
    },
    director: {
      type: String,
      required: {
        value: true,
        message: 'Поле director является обязательным',
      },
    },
    duration: {
      type: Number,
      required: {
        value: true,
        message: 'Поле duration является обязательным',
      },
    },
    year: {
      type: String,
      required: {
        value: true,
        message: 'Поле year является обязательным',
      },
    },
    description: {
      type: String,
      required: {
        value: true,
        message: 'Поле description является обязательным',
      },
    },
    image: {
      type: String,
      required: {
        value: true,
        message: 'Поле image является обязательным',
      },
      validate: {
        validator: (v) => /^(ftp|http|https):\/\/[^ "]+$/.test(v),
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    trailerLink: {
      type: String,
      required: {
        value: true,
        message: 'Поле trailerLink является обязательным',
      },
      validate: {
        validator: (v) => /^(ftp|http|https):\/\/[^ "]+$/.test(v),
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    thumbnail: {
      type: String,
      required: {
        value: true,
        message: 'Поле thumbnail является обязательным',
      },
      validate: {
        validator: (v) => /^(ftp|http|https):\/\/[^ "]+$/.test(v),
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    movieId: {
      type: Number,
      required: {
        value: true,
        message: 'Поле movieId является обязательным',
      },
    },
    nameRU: {
      type: String,
      required: {
        value: true,
        message: 'Поле nameRU является обязательным',
      },
    },
    nameEN: {
      type: String,
      required: {
        value: true,
        message: 'Поле nameEN является обязательным',
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false, timestamps: true },
);

module.exports = mongoose.model('movie', movieSchema);
