const db = require('./db');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class ExchangeRate extends Model {

}


ExchangeRate.init({
    rate: {
        type: Sequelize.STRING,
    },
    displayName: {
        type: Sequelize.STRING,
    }
}, {
    sequelize: db,
    modelName: 'exchangerate',
})


module.exports = ExchangeRate;