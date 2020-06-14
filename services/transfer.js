const Sequelize = require('sequelize');
const db = require('./db');
const Model = Sequelize.Model;
const Op = Sequelize.Op;


class Transfer extends Model {

    static async addNew(from, to, amount, message, currencyUnit, bankCode) {
        const newTf = {
            from,
            to,
            amount,
            message,
            currencyUnit,
            bankCode,
        }
        return this.create(newTf).then(value => value);
    }

    static async getActivity(id) {
        return this.findAll({
            where: {
                [Op.or]: [
                    {
                        from: id
                    },
                    {
                        to: id
                    }
                ]
            }
        })
    }
}

Transfer.init({
    //attributes
    from: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    to: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    amount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    message: {
        type: Sequelize.STRING,
    },
    bankCode: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW(),
    },
    currencyUnit: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "USD",
    }

}, {
    sequelize: db,
    modelName: 'transfer',
})


// User.hasOne(Transfer, { foreignKey: 'from', sourceKey: 'id' })
// User.hasOne(Transfer, { foreignKey: 'to', sourceKey: 'id' })
// Bank.hasOne(Transfer, { foreignKey: 'bankCode', sourceKey: 'bankCode' })


module.exports = Transfer;

