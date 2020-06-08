const Sequelize = require('sequelize');


//Nhat
<<<<<<< HEAD
// const connectionString = process.env.DATABASE_URL || 'postgres://postgres:1604@localhost:5432/bank';
=======
// const connectionString = process.env.DATABASE_URL || 'postgres://postgres:1604@localhost:5432/todo07';
>>>>>>> be870e701838c41b2e48b3a5e059faaa3963c80c
//Hau
// const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/bank';
//Hoang
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/transfer';
<<<<<<< HEAD

=======
>>>>>>> be870e701838c41b2e48b3a5e059faaa3963c80c
const db = new Sequelize(connectionString);


module.exports = db;





