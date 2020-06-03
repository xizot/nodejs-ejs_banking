const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('./db');
const Model = Sequelize.Model;
class Bank extends Model {
}

Bank.init({
    //attributes
    bankCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    displayName: {
        type: Sequelize.STRING,
        allowNull: false,
    }
}, {
    sequelize: db,
    modelName: 'bank'
})




module.exports = Bank;

