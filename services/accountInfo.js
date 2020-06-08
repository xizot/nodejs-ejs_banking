const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('./db');
const Model = Sequelize.Model;
const User = require('./user');
const Bank = require('./bank');
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

class AccountInfo extends Model {

    static async getBySTK(stk) {
        return this.findAll({
            where: {
                STK: stk,
            }
        })
    }
    static async getBySTKAndBankCode(stk, bankcode) {
        return this.findOne({
            where: {
                STK: stk,
                bankCode: bankcode,
            }
        })
    }

    static async getByBankCode(bankCode) {
        return this.findAll({
            where: {
                bankCode: bankCode,
            }
        })
    }

    static async getByUserID(userID) {
        return this.findOne({
            where: {
                userID: userID,
            }
        })
    }

    async addMoney(from, money) {
        const foundFrom = await AccountInfo.getByUserID(from);
        if (foundFrom) {
            foundFrom.balance = Number(foundFrom.balance) - Number(money);
            foundFrom.save();

            this.balance = Number(this.balance) + Number(money);
            return this.save();
        }

    }


    static async setActive(id, num) {
        const found = await this.findByPk(id);

        if (found) {
            found.isActive = num;
            found.save();
        }
    }

}

AccountInfo.init({
    //attributes
    STK: {
        //so tai khoan
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    balance: {
        //so du tai khoan
        type: Sequelize.STRING,
        allowNull: false,
    },
    currencyUnit: {
        // loai tien te
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    beginDate: {
        //ngay mo the
        type: Sequelize.DATE,
        allowNull: false,
    },
    endDate: {
        //ngay het han
        type: Sequelize.DATE,
        allowNull: false,
    },
    term: {
        // ki han
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    isActive: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    bankCode: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    userID: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    limit: {
        type: Sequelize.INTEGER,
        defaultValue: 20000000,
    }

}, {
    sequelize: db,
    modelName: 'accountinfor'
})

// User.hasOne(AccountInfo, { foreignKey: 'userID', sourceKey: 'id' });
// Bank.hasOne(AccountInfo, { foreignKey: 'bankCode', sourceKey: 'bankCode' })




module.exports = AccountInfo;

