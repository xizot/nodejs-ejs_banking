const db = require('./db');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const { uuid } = require('uuidv4');
// can than

class Customer extends Model {

    // Trả về tất cả danh sách (Promise)
    static async getAll() {
        return this.findAll();
    }

    // Trả về một khách hàng (return Promise)
    static async getByID(id) {
        return this.findByPk(id);
    }

    // Trả về 1 khách hàng. khi lấy dữ liệu nhớ để ý (return Promise)
    static async getByUserID(userID) {
        return this.findOne({
            where: {
                userID,
            }
        })
    }

}

Customer.init({
    userID: {
        type: Sequelize.INTEGER,

    },
    identityTypes: {
        type: Sequelize.INTEGER,

    },
    identity: {
        type: Sequelize.STRING,

    },
    beginDate: {
        type: Sequelize.DATE,

    },
    image: {
        type: Sequelize.STRING,
    },
    isActive: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    sequelize: db,
    modelName: 'customer',
})


// User.hasOne(Customer, { foreignKey: 'userID', sourceKey: 'id' });

module.exports = Customer;