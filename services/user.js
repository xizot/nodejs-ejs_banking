const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('./db');
const Model = Sequelize.Model;
const Customer = require('../services/customer');

class User extends Model {

    static async setPhoneNumberCode(id, number, code) {
        const found = await this.findByID(id);
        if (found) {
            found.phoneNumber = number;
            found.phoneCode = code;
            found.save();
        }
    }

    static async activePhoneNumber(id, code) {
        const found = await this.findByID(id);
        if (found && found.phoneCode == code) {
            found.phoneCode = null;
            found.save();
            return true;
        }
        return false;
    }
    static async getAll() {
        const user = await this.findAll({
            where: {
                token: null,
            }
        })
        return user;
    }
    static async findByID(id) {
        return User.findByPk(id);
    };
    static async findByEmail(email) {
        return User.findOne({
            where: {
                email,
            }
        });
    };
    static async findByUsername(username) {
        return User.findOne({
            where: {
                username: username,
            }
        });
    };
    static async findByPhoneNumber(phoneNumber) {
        return User.findOne({
            where: {
                phoneNumber: phoneNumber,
            }
        });
    };
    static async findBySomeThing(key) {
        // Tìm 1 user = email HOẶC EMaIL HOẶC phonE ??  HIểu K ?
        // find user BY username, email, phoneNumber. key la uẻname hoặc email hoặc phoneNumber ghi 3 cái luôn á
        // hoặc :# m truyền cái gì vào cung được 1 paramêtrr mà ba
        // / thích truyền email, ko thì user, ko thì phoneNumber nhưng mà tìm 3 4 cái mà thì truyền cái gì vào
        // m muốn tìm = cái gì
        // thì cứ truyền vào
        var found = await this.findByEmail(key) || await this.findByUsername(key) || await this.findByPhoneNumber(key);
        return found;

    }
    static async verifyPassword(password, hash) {
        return bcrypt.compare(password, hash);
    };

    static async createUser(user) {
        if (user) {
            return this.create(user).then(async user => {
                console.log(user);
                if (user) {
                    await Customer.create({
                        userID: user.id,
                        isActive: 0,
                    })
                }
                return user;
            });
        }
        return 0; // xảy ra lỗi
    }
}

User.init({
    //attributes
    displayName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
    },
    username: {
        type: Sequelize.STRING,
        unique: true,
    },
    phoneNumber: {
        type: Sequelize.STRING,
    },
    password: {
        type: Sequelize.STRING,
    },
    permisstion: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    phoneCode: {
        type: Sequelize.STRING,
    },
    facebookID: {
        type: Sequelize.STRING
    },
    googleID: {
        type: Sequelize.STRING
    },

    googleAccessToken: {
        type: Sequelize.STRING
    },
    facebookAccessToken: {
        type: Sequelize.STRING
    },
}, {
    sequelize: db,
    modelName: 'user'
})




module.exports = User;

