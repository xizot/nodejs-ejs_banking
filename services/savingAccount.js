const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('./db');
const Model = Sequelize.Model;
const Transfer = require('./transfer');
const ExchangeRate = require('./exchangeRate');
const AccountInfo = require('./accountInfo');
const User = require('./user');
const { sendRequest } = require('../services/userRequest');
const { sendMail } = require('./function')

class SavingAccount extends Model {

    static async createRequestSavingAccount(fromSTK, userID, balance, term, currencyUnit) {
        const user = await User.findByPk(userID);
        if (!user) return null;
        const foundAccountInfo = await AccountInfo.getBySTKOne(fromSTK)
        var money = balance;

        if (currencyUnit == "VND") {
            const rate = await ExchangeRate.findOne({
                where: {
                    displayName: 'VND',
                }
            })

            if (rate) {
                money = money * rate
            }
            else {
                money = money * (1 / 23000)
            }
        }

        if (!foundAccountInfo) return null; // loi
        if (Number(foundAccountInfo.balance) < Number(money)) return 1; // khong du tien

        foundAccountInfo.balance = Number(foundAccountInfo.balance) - Number(money);


        const STK = new Date().valueOf();

        const rs = await SavingAccount.create({
            STK,
            fromSTK, userID, balance, term, currencyUnit
        })


        console.log(rs);

        if (!rs) return null;
        await sendRequest(user.id, 4);
        await Transfer.addNewExternal(userID, null, foundAccountInfo.STK, STK, balance, 'Gửi tiết kiệm', currencyUnit, 'ARG')



        sendMail(user.email, 'Gửi tiết kiệm', `Bạn vừa yêu cầu gửi tiết kiệm:\n
                    Tiền đã gửi: ${money} ${currencyUnit} \n
                    Phí gửi tiền: 0 USD \n
                    Số dư: ${Number(foundAccountInfo.balance) - Number(money)} USD\n
                    Cảm ơn bạn đã tin tưởng,\n
                    Payyed.

                `, `<h3 style="color:#333; text-transform:uppercase; text-align:center; font-size:30px; font-family:Tahoma,Arial,Helvetica,sans-serif">Bạn vừa yêu cầu gửi tiết kiệm:<h3>
                <div style="padding:20px;background-color:#f1f5f6; border-radius:10px;margin:30px;font-family:Tahoma,Arial,Helvetica,sans-serif; font-size:14px;color:#333">
                  <p>Tiền đã gửi:<b> ${money} ${currencyUnit}  </b></p>
                  <p>Phí gửi tiền:<b> 0 USD </b></p>
                  <p>Số dư:<b> ${Number(foundAccountInfo.balance) - Number(money)} USD </b></p>
                  <p style="margin:20px 0 0">Cảm ơn bạn đã tin tưởng,</p>
                  <p style="font-size:18px; margin-top:5px; font-weight:bold">Pa<span style="color:#29ad57">yy</span>ed.</p>
                </div>
            `)

        await foundAccountInfo.save();
        return 0;



    }

    static async acceptSavingAccount(STK, userID) {
        return await SavingAccount.update({
            isActive: 1,
        }, {
            where: {
                userID,
                STK
            }
        })
    }
    static async ejectSavingAccount(STK, userID) {
        const user = await User.findByPk(userID);
        if (!user) return null;

        const found = await SavingAccount.findOne({
            where: {
                STK,
                userID
            }
        })
        if (!found) return null;
        console.log(found);

        const rs = await AccountInfo.addMoneyForSTK(found.fromSTK, userID, found.balance)
        if (!rs) return null;

        await Transfer.addNewExternal(null, userID, STK, rs.STK, found.balance, 'Hoàn trả tiết kiệm', found.currencyUnit, 'ARG')

        await SavingAccount.destroy({
            where: {
                STK,
                userID
            }
        })

        sendMail(user.email, 'Từ chối gửi tiết kiệm', `Bạn vừa bị từ chối yêu cầu tiết kiệm:\n
                    Tiền nhận lại: ${found.balance} ${found.currencyUnit} \n
                    Phí: 0 USD \n
                    Số dư: ${rs.balance} USD\n
                    Cảm ơn bạn đã tin tưởng,\n
                    Payyed.

                `, `<h3 style="color:#333; text-transform:uppercase; text-align:center; font-size:30px; font-family:Tahoma,Arial,Helvetica,sans-serif">Bạn vừa bị từ chối yêu cầu tiết kiệm:<h3>
                <div style="padding:20px;background-color:#f1f5f6; border-radius:10px;margin:30px;font-family:Tahoma,Arial,Helvetica,sans-serif; font-size:14px;color:#333">
                  <p>Tiền nhận lại:<b> ${found.balance} ${found.currencyUnit}</b></p>
                  <p>Phí :<b> 0 USD </b></p>
                  <p>Số dư:<b>  ${rs.balance} USD </b></p>
                  <p style="margin:20px 0 0">Cảm ơn bạn đã tin tưởng,</p>
                  <p style="font-size:18px; margin-top:5px; font-weight:bold">Pa<span style="color:#29ad57">yy</span>ed.</p>
                </div>
            `)

        return 0;

    }
}

SavingAccount.init({
    //attributes
    STK: {
        //so tai khoan
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    userID: {
        type: Sequelize.INTEGER,
    },
    balance: {
        //so du tai khoan
        type: Sequelize.DECIMAL,
        defaultValue: 0,
    },
    currencyUnit: {
        // loai tien te : USD / VND
        type: Sequelize.STRING,
        defaultValue: 'USD'
    },
    beginDate: {
        //ngay mo the
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
    isActive: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    }, term: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },
    fromSTK: {
        type: Sequelize.STRING,
    },

}, {
    sequelize: db,
    modelName: 'savingaccount'
})


module.exports = SavingAccount;

