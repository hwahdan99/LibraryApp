const Sequelize = require('sequelize');

const databaseConfig = {
    database: 'library',
    username: '',
    password: '',
    host: 'localhost',
    dialect: 'postgres'
};

const sequelize = new Sequelize(databaseConfig.database, databaseConfig.username,databaseConfig.password , {
    host: databaseConfig.host,
    dialect: databaseConfig.dialect,
});

module.exports = sequelize;