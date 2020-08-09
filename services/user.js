const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('./db');
const Model = Sequelize.Model;
const Customer = require('../services/customer');
const crypto = require('crypto');
const { sendMail } = require('../services/function');

class User extends Model {

    static async findClient(st) {

        const rs = [];

        const found = await User.findAll({
            where:
            {
                [Sequelize.Op.and]:
                    [
                        {
                            [Sequelize.Op.or]: [
                                {
                                    displayName: {
                                        [Sequelize.Op.startsWith]: st
                                    },
                                },
                                {
                                    username: {
                                        [Sequelize.Op.startsWith]: st
                                    },
                                },
                                {
                                    email: {
                                        [Sequelize.Op.startsWith]: st
                                    },
                                }

                            ]
                        }
                        ,
                        {
                            permisstion: 0
                        }
                    ]
            }
        })

        if (found.length > 0) return found;
        try {
            if (Number(st)) {
                const f2 = await User.findOne({
                    where:
                    {
                        [Sequelize.Op.and]:
                            [
                                {
                                    id: st
                                }
                                ,
                                {
                                    permisstion: 0
                                }
                            ]
                    }
                });
                if (f2) rs.push(f2);
            }
        } catch (error) {

        }
        return rs;
    }
    static async getClient(page, limit) {
        const user = await this.findAll({
            where: {
                permisstion: {
                    [Sequelize.Op.ne]: 1
                }
            },
            limit,
            offset: (page - 1) * limit,
            order: [['id', 'ASC']]
        })
        return user;
    }
    static async countClient() {
        const count = await this.count({
            where: {
                permisstion: {
                    [Sequelize.Op.ne]: 1
                }
            }
        })
        return (Math.floor(count / 6) + (count % 6 > 0 ? 1 : 0))
    }
    static async checkDEmail(id, email) {
        const foundEmail = await User.findAll({
            where: {
                id: {
                    [Sequelize.Op.not]: id
                },
                email,
            }
        })
        if (foundEmail.length > 0) return true;
        return false;
    }

    static async checkDUsername(id, username) {
        const foundUsername = await User.findAll({
            where: {
                id: {
                    [Sequelize.Op.not]: id
                },
                username,
            }
        })

        if (foundUsername.length > 0) return true;
        return false;
    }
    static async setPhoneNumberCode(id, number, code) {
        const found = await this.findByID(id);
        if (found) {
            found.phoneNumber = number;
            found.phoneCode = code;
            found.save();
        }
    }

    async confirmForgotCode(code) {
        if (this.forgotCode === code) {
            this.forgotCode = null;
            return this;
        }
        return null;
    }

    async forgotPassword() {
        const forgotCode = crypto.randomBytes(3).toString('hex').toUpperCase();

        sendMail(this.email, 'Quên mật khẩu', forgotCode, forgotCode);
        this.forgotCode = forgotCode;
        return this.save();
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
        return await User.findByPk(id);
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

        if (!found && Number(key)) {
            found = await this.findByID(key);
        }
        return found;

    }
    static async verifyPassword(password, hash) {
        return bcrypt.compare(password, hash);
    };

    static async createUser(user) {
        return await User.create(user).then(async data => {
            if (data) {
                await Customer.create({
                    userID: data.id,
                    isActive: 0,
                })
            }
            return data;
        });
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
    // 0: chua xac thuc
    // 1: da xac thuc
    // 2: da bi khoa
    isActive: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },
    token: {
        type: Sequelize.STRING
    },
    forgotCode: {
        type: Sequelize.STRING
    },
    dob: {
        type: Sequelize.DATEONLY,
    },
    address: {
        type: Sequelize.STRING,
    },

}, {
    sequelize: db,
    modelName: 'user'
})




module.exports = User;

