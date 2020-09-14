const Sequelize = require('sequelize');
const db = require('./database');

module.exports = db.define('example', {
  name: Sequelize.STRING,
  description: Sequelize.TEXT,
});
