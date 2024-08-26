const { Sequelize, DataTypes } = require('sequelize');
const config = require('../../../config.json');
const sequelize = new Sequelize(config.development.connStr);

const PaymentRecords = require('./PaymentRecords')(sequelize, DataTypes);
const UserRecords = require('./UserRecords')(sequelize, DataTypes);

sequelize.sync({ force: false }).then(() => {
  console.log('Database & tables created!');
});

module.exports = { UserRecords, PaymentRecords };
