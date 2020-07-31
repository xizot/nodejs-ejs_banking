const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('./db');
const Model = Sequelize.Model;
const Transfer = require('./transfer');
const Notification = require('./notification');
const StaffActivity = require('./staffActivityLog');
const ExchangeRate = require('./exchangeRate');

class AccountInfo extends Model {


    static async getInfoBySTKandUserID(userID, STK) {
        return this.findOne({
            where: {
                STK,
                userID,
            }
        })
    }

    static async getBySTK(stk) {
        return this.findOne({
            where: {
                STK: stk,
            }
        })
    }
    static async getBySTKOne(stk) {
        return this.findOne({
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
                isDefault: true,
            }
        })
    }

    async addMoney(from, amount, message, currencyUnit, bankCode) {

        const foundFrom = await AccountInfo.getByUserID(from);
        var money = amount;

        if (currencyUnit == "VND") {
            const rate = await ExchangeRate.findOne({
                where: {
                    displayName: 'VND',
                }
            })

            if (rate) {
                money = money * rate
            }
            else {
                money = money * (1 / 23000)
            }
        }
        if (foundFrom) {
            foundFrom.balance = foundFrom.balance - money;
            foundFrom.save();
            this.balance = Number(this.balance) + (Number(money));
            this.save();
            await Transfer.addNew(foundFrom.userID, this.userID, foundFrom.STK, this.STK, amount, message, currencyUnit, bankCode);
            return this;
        }
    }


    // hàm này để chuyển tiền khác ngân hàng
    async addMoneyExternal(from, amount, message, currencyUnit, bankCode) {

        var money = amount;

        if (currencyUnit == "VND") {
            money = money * (1 / 23000);
        }

        this.balance = Number(this.balance) + (Number(money));
        this.save();

        await Transfer.addNewExternal(from, this.STK, amount, message, currencyUnit, bankCode);
        return this;
    }

    static async minusMoney(to, amount, currencyUnit, bankCode) {
        let money = amount;

        if (currencyUnit == "VND") {
            money = money * (1 / 23000);
        }
        const foundTo = await AccountInfo.getBySTKOne(to);

        if (!foundTo) return 3;

        foundTo.balance = Number(foundTo.balance) + Number(money);
        await foundTo.save();
    }


    // Hàm này để chuyển tiền cùng ngân hàng
    static async addMoneyInternal(from, to, amount, message, currencyUnit, bankCode, fromUser) {
        let money = amount;
        if (currencyUnit == "VND") {
            const rate = await ExchangeRate.findOne({
                where: {
                    displayName: 'VND',
                }
            })

            if (rate) {
                money = Number(money) * Number(rate.rate);
            }
            else {
                money = Number(money) * Number(1 / 23000)
            }
        }

        let foundFrom = null;
        if (from != "ADMIN") {
            foundFrom = await this.getBySTKOne(from);
            if (!foundFrom) return 4;
            if (Number(money) > foundFrom.limit) return 8;
            if (Number(foundFrom.balance) < Number(money)) return 7;
            await foundFrom.save();
            foundFrom.balance = Number(foundFrom.balance) - Number(money);
            await foundFrom.save();

        }

        const foundTo = await AccountInfo.getBySTKOne(to);

        if (!foundTo && foundFrom) {
            foundFrom.balance = Number(foundFrom.balance) + Number(money);
            await foundFrom.save();
            return 2;
        }


        foundTo.balance = Number(foundTo.balance) + Number(money);
        await foundTo.save();


        Transfer.addNewInExternal(from, to, amount, message, currencyUnit, bankCode, fromUser, foundTo.userID);

        return 0;
    }
    // hàm này để Nhân viên thêm tiền cho User
    async staffRecharge(staffID, currencyUnit, amount) {

        let money = amount;

        if (currencyUnit == "VND") {
            money = money * (1 / 23000);
        }

        this.balance = Number(this.balance) + Number(money);
        this.save();
        Notification.addNotifyForStaffRecharge(staffID, this.userID).then(value => {
            const msg = `Nhân viên ${staffID} đã nạp tiền cho ${this.userID} số tiền ${amount}`;
            StaffActivity.addStaffActivity(staffID, msg);

            const tfMsg = `Nhân viên đã nạp tiền vào tài khoản của bạn số tiền ${amount}`;
            Transfer.staffAddNew(staffID, this.userID, this.STK, amount, tfMsg, currencyUnit);
            return true;
        })

        return null;

    }

    static async setActive(id, num) {
        const found = await this.findByPk(id);

        if (found) {
            found.isActive = num;
            found.save();
        }
    }

    // hàm này để set tài khoản giao dịch mặc định
    static async setDefault(userID, STK, bankCode) {
        return this.findOne({
            where: {
                STK: STK,
                userID: userID,
                bankCode: bankCode,
                isDefault: true,
            }
        })


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
    // chủ sở hữu
    displayName: {
        type: Sequelize.STRING,
    },
    userID: {
        type: Sequelize.INTEGER,
    },
    balance: {
        //so du tai khoan
        type: Sequelize.DECIMAL,
        defaultValue: 0,
    },
    currencyUnit: {
        // loai tien te : USD / VND
        type: Sequelize.STRING,
        defaultValue: 'USD'
    },
    beginDate: {
        //ngay mo the
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
    isActive: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },
    // ma ngan hang ARG: agribank / TECHCOMBANK: Techombank
    bankCode: {
        type: Sequelize.STRING,
        defaultValue: 'ARG'
    },
    limit: {
        type: Sequelize.DECIMAL,
        defaultValue: 5000,
    },
    isDefault: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    }

}, {
    sequelize: db,
    modelName: 'accountinfor'
})

// User.hasOne(AccountInfo, { foreignKey: 'userID', sourceKey: 'id' });
// Bank.hasOne(AccountInfo, { foreignKey: 'bankCode', sourceKey: 'bankCode' })




module.exports = AccountInfo;

