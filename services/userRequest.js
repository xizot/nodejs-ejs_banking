
const Sequelize = require('sequelize');
const db = require('./db');
const Model = Sequelize.Model;
const Customer = require('./customer');
const User = require('./user');
const AccountInfor = require('./accountInfo');
const { randomSTK } = require('./function');

class UserRequest extends Model {

    static async sendRequest(userID, type) {
        const found = await UserRequest.findOne({
            where: {
                userID,
                type
            }
        })
        if (found) return 1; // ddax ton tai

        return UserRequest.create({
            userID,
            type
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

    static async verifyAccount(userID, identityTypes, identity, beginDate, image) {
        const found = await Customer.getByUserID(userID);
        const foundUser = await User.findByPk(userID);

        if (!foundUser) return null;

        if (!found) {
            const newCustomer = await Customer.create({
                userID,
                identityTypes,
                identity,
                beginDate,
                image,
                isActive: -1
            })

            if (!newCustomer) return null;
            if (newCustomer) return newCustomer

        }
        if (found && foundUser) {

            //Customer
            found.identityTypes = identityTypes;
            found.identity = identity;
            found.beginDate = beginDate;
            found.image = image;
            found.isActive = -1;
            found.save();


            //User
            foundUser.isActive = -1;
            foundUser.save();

            //delete old request
            UserRequest.destroy({
                where: {
                    userID,
                    type: 1,
                }
            })

            //send request
            return await UserRequest.create({
                userID,
                type: 1,
            }).then((value) => value);
        }
        return null;
    }
    static async createCreditCard(userID) {
        const found = await this.findOne({
            where: {
                userID,
                type: 2,
            }
        })
        if (found) return null; // ddax ton tai

        return this.create({
            userID,
            type: 2,
        }).then(value => value);
    }
    static async createSavingAccount(userID) {
        const found = await this.findOne({
            where: {
                userID,
                type: 3,
            }
        })
        if (found) return null; // ddax ton tai

        return this.create({
            userID,
            type: 3,
        }).then(value => value);
    }
    static async blockAccount(userID) {
        const found = await this.findOne({
            where: {
                userID,
                type: 4,
            }
        })
        if (found) return null; // ddax ton tai

        return this.create({
            userID,
            type: 4,
        }).then(value => value);
    }
    static async findByType(type) {
        return this.findAll({
            where: {
                type,
            },
            order: [
                ['createdAt', 'DESC'],
            ]

        });
    }


    static acceptRequest(id) {
        return this.destroy({
            where: {
                id,
            },
        })
    }

}

UserRequest.init({
    //attributes
    userID: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
    type: {

        // 1: Xác thực tài khoản
        // 2: Tạo tài khoản ngân hàng
        // 3: Tạo tài khoản tiết kiệm
        // 4: yêu cầu khóa tài khoản
        type: Sequelize.INTEGER
    }
}, {
    sequelize: db,
    modelName: 'userrequest'
})




module.exports = UserRequest;

