const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('./db');
const Model = Sequelize.Model;

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
        // find user by username, email, id, phoneNumber
        var found = await this.findByEmail(key) || await this.findByUsername(key) || await this.findByPhoneNumber(key);
        return found;

    }
    static async verifyPassword(password, hash) {
        return bcrypt.compare(password, hash);
    };

    static async createUser(user) {
        if (user) {
            return this.create(user).then(user => user);
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

