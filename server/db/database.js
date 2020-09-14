const Sequelize = require('sequelize');

const db = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localhost:5432/example',
  {
    logging: false,
  }
);

module.exports = db;
