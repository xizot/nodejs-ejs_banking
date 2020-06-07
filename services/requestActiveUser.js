const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('./db');
const Model = Sequelize.Model;
const Customer = require('./customer');
const Bank = require('./bank');

class RequestActiveUser extends Model {

    static async sendRequest(userID, identityTypes, identity, beginDate, image) {
        const found = await Customer.getByUserID(userID);
        if (found) {
            found.identityTypes = identityTypes;
            found.identity = identity;
            found.beginDate = beginDate;
            found.image = image;
            found.isActive = 0;
            found.save();

            return this.create({
                userID,
            }).then((value) => value);
        }
    }

    static async confirmRequest(userID) {
        const found = await Customer.getByUserID(userID);

        if (found) {
            found.isActive = 1;
            return found.save();
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

