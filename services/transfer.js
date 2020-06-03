const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('./db');
const Model = Sequelize.Model;
// const users = [
//     {
//         id: '1',
//         email: '1760131',
//         password: '$2b$10$SDLblW5wg5PqJAqq.vR.s.0aCJfHMwkjGc.o4MLnzeE2N3TlEGGDW',
//         displayName: 'Nguyen Van Nhat'
//     },
//     {
//         id: '1',
//         email: '1760057',
//         password: '$2b$10$sTrBCRx1QYd857GcTz.3supgeGZPIei1d2GinrSIQUGv05q.eTvfS',
//         displayName: 'Minh Hau Pham Thi'
//     },

// ]

class Transfer extends Model {
}

Transfer.init({
    //attributes
    from: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    to: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    amount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    message: {
        type: Sequelize.STRING,
    },
    bankID: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    date: {
        type: Sequelize.Date,
        allowNull: false,
        defaultValue: Sequelize.NOW(),
    },
    limit: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    }

}, {
    sequelize: db,
    modelName: 'transfer'
})




module.exports = User;

