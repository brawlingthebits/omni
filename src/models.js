require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');

// Adjust these parameters with your config or environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,  // Turn off logging for testing
    define: {
        freezeTableName: true
    }
  }
);

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: DataTypes.STRING
}, {
  timestamps: false
});

module.exports = {
  sequelize,
  User
};
