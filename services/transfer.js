const Sequelize = require('sequelize');
const db = require('./db');
const Model = Sequelize.Model;
const Op = Sequelize.Op;

const Notification = require('./notification');
const AccountInfo = require('./accountInfo');

class Transfer extends Model {


    // hàm này để lấy lịch sử giao dich theo thời gian nhất định của 1 user
    static async getActivityByDate(stk, page, limit, fromDate, toDate) {
        const found = await this.findAll({
            where: {
                [Op.or]: [
                    {
                        from: stk
                    },
                    {
                        to: stk
                    }
                ],
                createdAt: {
                    [Op.and]: [
                        {
                            [Op.gte]: fromDate
                        },
                        {
                            [Op.lte]: toDate
                        }
                    ]

                }

            },
            limit,
            offset: (page - 1) * limit,
            order: [['createdAt', 'DESC']]
        })

        if (found.length <= 0) return found;
        const rs = found.map((item) => {
            return {
                date: new Date(item.createdAt).toISOString().slice(5, 10),
                des: item.from === stk ? 'Đã gửi tiền cho ' + item.to : 'Đã nhận tiền từ ' + item.from,
                amount: item.from === stk ? '-' + item.amount : '+' + item.amount,
                currencyUnit: item.currencyUnit,

            }
        })
        return (rs);
    }
    static async countActivity(stk, fromDate, toDate) {
        const count = await this.count({
            where: {
                [Op.or]: [
                    {
                        from: stk
                    },
                    {
                        to: stk
                    }
                ],
                createdAt: {
                    [Op.and]: [
                        {
                            [Op.gte]: fromDate
                        },
                        {
                            [Op.lte]: toDate
                        }
                    ]

                }
            },

        })
        return (Math.floor(count / 7) + (count % 7 > 0 ? 1 : 0));

    }

    static async addNew(fromUser, toUser, fromSTK, toSTK, amount, message, currencyUnit, bankCode) {
        const newTf = {
            from: fromSTK,
            to: toSTK,
            amount,
            message,
            currencyUnit,
            bankCode,
            fromUser,
            toUser,
        }
        return this.create(newTf).then(value => value);
    }


    static async addNewExternal(fromSTK, toSTK, amount, message, currencyUnit, bankCode) {
        const newTf = {
            from: fromSTK,
            to: toSTK,
            amount,
            message,
            currencyUnit,
            bankCode,
        }
        return this.create(newTf).then(value => {

            Notification.addNotifyForTransfer(fromSTK, toSTK);
            return value;
        });
    }

    static async addNewInExternal(fromSTK, toSTK, amount, message, currencyUnit, bankCode, fromUser, toUser) {
        const newTf = {
            from: fromSTK,
            to: toSTK,
            amount,
            message,
            currencyUnit,
            bankCode,
        }
        return this.create(newTf).then(async value => {
            await Notification.addNotifyForTransfer(fromSTK, toSTK, fromUser, toUser);

            return value;
        });
    }

    static async addError(fromSTK, toSTK) {
        return this.create({
            from: fromSTK,
            to: toSTK,
            message: 'Đã xảy ra lỗi',
            status: -1,
        })
    }
    static async staffAddNew(staffID, toUser, toSTK, amount, message, currencyUnit) {
        const newTf = {
            to: toSTK,
            amount,
            message,
            currencyUnit,
            fromUser: staffID,
            toUser,
        }
        return this.create(newTf).then(value => value);
    }


    // hàm này để lấy thông tin giao dịch của 1 user có phân trang
    static async getActivityLimit(id, page, limit) {
        return this.findAll({
            where: {
                [Op.or]: [
                    {
                        from: id
                    },
                    {
                        to: id
                    }
                ]
            },
            limit,
            offset: page * limit,
        })
    }
    static async getActivity(id) {
        return this.findAll({
            where: {
                [Op.or]: [
                    {
                        from: id
                    },
                    {
                        to: id
                    }
                ]
            }
        })
    }
}

Transfer.init({
    //attributes
    from: { // STK
        type: Sequelize.STRING,
    },
    to: { //STK
        type: Sequelize.STRING,
    },
    amount: {
        type: Sequelize.DOUBLE,
    },
    message: {
        type: Sequelize.STRING,
    },
    bankCode: {
        type: Sequelize.STRING,
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW(),
    },
    currencyUnit: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "USD",
    },
    fromUser: {
        type: Sequelize.INTEGER,
    },
    toUser: {
        type: Sequelize.INTEGER,
    },
    status: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
    }

}, {
    sequelize: db,
    modelName: 'transfer',
})



module.exports = Transfer;

