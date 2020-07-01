const db = require('./db');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;


class StaffActivityLog extends Model {

}

StaffActivityLog.init({
    staffID: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },

}, {
    sequelize: 'db',
    modelName: 'staffactivitylog'
})

module.exports = StaffActivityLog;
