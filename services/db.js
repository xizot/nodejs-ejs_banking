const Sequelize = require('sequelize');


//Nhat
// const connectionString = process.env.DATABASE_URL || 'postgres://postgres:1604@localhost:5432/bank';
// const connectionString = process.env.DATABASE_URL || 'postgres://postgres:1604@localhost:5432/todo07';
//Hau
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/bank';
//Hoang
// const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/transfer';

const db = new Sequelize(connectionString);


module.exports = db;





