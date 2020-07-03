const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('./db');
const Model = Sequelize.Model;
const Customer = require('./customer');
const Bank = require('./bank');
const User = require('./user');
const AccountInfor = require('./accountInfo');
const { randomSTK } = require('./function');

class RequestCreateCreditCard extends Model {

    static async sendRequest(userID, displayName) {
        return this.create({
            userID,
            displayName
        }).then(value => value);
    }

    static async confirmRequest(userID, displayName) {

        const STK = randomSTK();
        return await AccountInfor.create({
            STK,
            displayName,
            balance: 5000,
            currencyUnit: "USD",
            beginDate: new Date().toISOString,
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)),
            term: 5,
            isActive: 1,
            bankCode: "ARG",
            userID,
            isDefault: false,


        })

    }

    static async ejectRequest(userID) {
        const found = await Customer.getByUserID(userID);
        const foundUser = await User.findByID(userID);
        if (found && foundUser) {
            found.isActive = -2;
            found.save()
            foundUser.isActive = -2;
            return foundUser.save();
        }
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
    displayName: {
        type: Sequelize.STRING,
        allowNull: false,
    }

}, {
    sequelize: db,
    modelName: 'requestcreatecreditcard'
})




module.exports = RequestActiveUser;

