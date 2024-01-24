const validator = require('validator');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: {
        value: true,
        message: 'Имя пользователя является обязательным',
      },
      minlength: [2, 'Минимальная длинна 2 символа'],
      maxlength: [30, 'Максимальная длинна 30 символов'],
    },
    email: {
      type: String,
      required: {
        value: true,
        message: 'Поле email является обязательным',
      },
      unique: true,
      validate: {
        validator: (email) => validator.isEmail(email),
        message: 'Некорректный формат email',
      },
    },
    password: {
      type: String,
      required: {
        value: true,
        message: 'Поле password является обязательным',
      },
      select: false,
    },
  },
  { versionKey: false, timestamps: true },
);

module.exports = mongoose.model('user', userSchema);
