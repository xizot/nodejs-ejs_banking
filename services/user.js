const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('../services/db');
const Model = Sequelize.Model;
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

class User extends Model {

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
    static async findUserByEmail(email) {
        return User.findOne({
            where: {
                email,
            }
        });
    };
    static async verifyPassword(password, hash) {
        return bcrypt.compare(password, hash);
    };

    static async addUser(email, password, displayName, token) {
        const hashpw = bcrypt.hashSync(password, 10);
        const newUser = {
            email,
            password: hashpw,
            displayName: displayName || "No Name",
            token,
        }
        if (newUser) {
            await User.create(newUser);
            const tmp = await this.findUserByEmail(email);
            return tmp;
        }

        return false;
    }

    static async active(token, userId) {
        const found = await this.findByID(userId);
        if (found.token === token) {
            found.token = null;
            found.save();
            return true;
        }
        return false;
    }
}

User.init({
    //attributes
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    displayName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    token: {
        type: Sequelize.STRING
    }
}, {
    sequelize: db,
    modelName: 'user'
})




module.exports = User;

