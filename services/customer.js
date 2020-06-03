const db = require('./db');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const { uuid } = require('uuidv4');

class Customer extends Model {

    // Trả về tất cả danh sách (Promise)
    static async getAll() {
        return this.findAll();
    }

    // Trả về một khách hàng (return Promise)
    static async getByID(id) {
        return this.findByPk(id);
    }

    // Trả về danh sách khách hàng. khi lấy dữ liệu nhớ để ý (return Promise)
    static async getByUserID(userID) {
        return this.findAll({
            where: {
                userID: userID,
            }
        })
    }

}


Customer.init({
    userID: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    identityTypes: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    identity: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    beginDate: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    image: {
        type: Sequelize.INTEGER,
    },
    bankID: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
}, {
    sequelize: db,
    modelName: 'customer',
})