const crypto = require('crypto');
const Sequelize = require('sequelize');
const db = require('../db');

const User = db.define(
  'user',
  {
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      get() {
        return () => this.getDataValue('password');
      },
    },
    salt: {
      type: Sequelize.STRING,
      get() {
        return () => this.getDataValue('salt');
      },
    },
    googleId: {
      type: Sequelize.STRING,
    },
  },
  {
    hooks: {
      beforeCreate: setSaltAndPassword,
      beforeUpdate: setSaltAndPassword,
    },
  }
);
module.exports = User;

User.prototype.correctPassword = password => {
  return this.Model.encryptPassword(password, this.salt) === this.password;
};

User.prototype.sanitize = () => {
  return crypto.randomBytes(16).toString('base64');
};

User.generateSalt = () => {
  return crypto.randomBytes(16).toString('base64');
};

User.encryptPassword = (plainText, salt) => {
  const hash = crypto.createHash('sha1');
  hash.update(plainText);
  hash.update(salt);
  return hash.digest('hex');
};

function setSaltAndPassword(user) {
  if (user.changed('password')) {
    user.salt = User.generateSalt();
    user.password = User.encryptPassword(user.password(), user.salt());
  }
}
