const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('./db');
const Op = Sequelize.Op;
const Model = Sequelize.Model;
const User = require('../services/user');
class SavingAccounts extends Model {
    static async getAll() {
        const savingsAccount = await this.findAll({
            where: {
                
            }
        })
        return savingsAccount;
    };
     static async findByID(id) {
        return SavingAccounts.findByPk(id);
    };
    //Gửi tiết kiệm
    static async addSaving(id,userId, period,interestRate,date,balance,money){
        const foundFrom = await SavingAccounts.getByIDandUserID(id,userId);
        if (foundFrom) {
            foundFrom.balance = foundFrom.balance + money;
            foundFrom.save();
            this.balance = Number(this.balance) + (Number(money));
            this.save();
            await SavingAccounts.addSaving(foundFrom.id, this.id,foundFrom.userId, this.userId, period,interestRate,date,balance);
            return this;
        }

    };
    //Rút tiền tiết kiệm 
    static async Withdrawal()
    {

    };
    //Chuyển tiền
    static async Transfer()
    {

    };


    static async getByIDandUserID(id,userId) {
        return this.findOne({
            where: {
                id: id,
                userId:userId,
            }
        })
    }
    static async findByUserId(userId) {
        return SavingAccounts.findOne({
            where: {
                userId,
            }
        });
    };
    static async findByDate(date) {
        return SavingAccounts.findOne({
            where: {
                username: date,
            }
        });
    };
  
}


SavingAccounts.init({
    //attributes
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey:true,
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
    },
    period: {
        type: Sequelize.INTEGER,
    },
    interestRate: { 
        type: Sequelize.STRING,
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false,
        unique: true,
    },   
    balance: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    money: {
        type: Sequelize.STRING,
        allowNull: false,
    },
}, {
    sequelize: db,
    modelName: 'savingsAccount'
})

module.exports = SavingAccounts;

