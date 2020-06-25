const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('./db');
const Model = Sequelize.Model;
const Customer = require('./customer');
const Bank = require('./bank');
const User = require('./user');

class RequestActiveUser extends Model {

    static async sendRequest(userID, displayName, identityTypes, identity, beginDate, image) {
        const found = await Customer.getByUserID(userID);
        const foundUser = await User.findByID(userID);
        if (found && foundUser) {

            //Customer
            found.identityTypes = identityTypes;
            found.identity = identity;
            found.beginDate = beginDate;
            found.image = image;
            found.isActive = -1;
            found.save();
            //User
            foundUser.displayName = displayName;
            foundUser.isActive = -1;
            foundUser.save();
            //send request
            return this.create({
                userID,
            }).then((value) => value);
        }
    }

    static async confirmRequest(userID) {
        const found = await Customer.getByUserID(userID);
        const foundUser = await User.findByID(userID);
        if (found && foundUser) {
            found.isActive = 1;
            found.save()
            foundUser.isActive = 1;
            return foundUser.save();
        }
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

RequestActiveUser.init({
    //attributes
    userID: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    }

}, {
    sequelize: db,
    modelName: 'requestactiveuser'
})




module.exports = RequestActiveUser;

