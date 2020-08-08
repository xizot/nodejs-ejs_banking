const Sequelize = require('sequelize');
const db = require('./db');
const Model = Sequelize.Model;

class StaffActivityLog extends Model {
    // hàm này để thêm 1 log của nhân viên 
    static async addStaffActivity(staffID, message) {
        return this.create({
            staffID,
            message,
        })
    }

    //  hàm này để lấy toàn bộ lịch sử hoạt động của staff
    static async getAllActivity(staffID, numpage, limit) {

        let offset = 0 + (numpage - 1) * limit
        return this.findAll({
            offset: offset,
            limit: limit,
            where: {
                staffID,
            },
            order: [['date', 'DESC']]
        })
    }
}


StaffActivityLog.init({
    staffID: {
        type: Sequelize.INTEGER,
    },
    message: {
        type: Sequelize.STRING,
    },
    date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW(),
    },

}, {
    sequelize: db,
    modelName: 'staffactivitylog'
})

module.exports = StaffActivityLog;
