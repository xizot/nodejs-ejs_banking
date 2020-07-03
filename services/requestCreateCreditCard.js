
const Sequelize = require('sequelize');
const db = require('./db');
const Model = Sequelize.Model;
const Customer = require('./customer');
const AccountInfor = require('./accountInfo');
const { randomSTK } = require('./function');

class RequestCreateCreditCard extends Model {

    static async sendRequest(userID) {
        const found = await this.findOne({
            where: {
                userID,
            }
        })
        if (found) return null; // ddax ton tai

        return this.create({
            userID,
            displayName
        }).then(value => value);
    }

    static async confirmRequest(userID) {

        const STK = randomSTK();
        const rs = await AccountInfor.create({
            STK,
            displayName,
            balance: 0,
            currencyUnit: "USD",
            beginDate: new Date().toISOString,
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)),
            term: 5,
            isActive: 1,
            bankCode: "ARG",
            userID,
            isDefault: false,
        })
        // remove request
        if (rs) {
            return this.destroy({
                where: {
                    userID,
                }
            })
        }
        return null;

    }

    static async ejectRequest(userID) {

    }
    static async block(userID) {
        const found = await Customer.getByUserID(userID);

        if (found) {
            found.isActive = 2;
            return found.save();
        }
    }
}

RequestCreateCreditCard.init({
    //attributes
    userID: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: db,
    modelName: 'requestcreatecreditcard'
})




module.exports = RequestCreateCreditCard;

