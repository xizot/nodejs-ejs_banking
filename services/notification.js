const Sequelize = require('sequelize');
const db = require('./db');
const Model = Sequelize.Model;
const Op = Sequelize.Op;


class Notification extends Model {


    //type = 1: thêm 1 thông báo chuyển tiền
    //type = 2: thêm 1 thông báo nhận tiền
    //type = 3: thêm 1 thông báo block tài khoản
    //type = 4: thêm 1 thông báo xóa tìa khoản
    //type = 5: thêm 1 thông báo staff 

    // tìm thông báo báo cho user

    // hàm này để thêm block/delete 1 user
    static async addPrevent(fromUser,toUser, type){
        return this.create({
            fromUser,
            toUser,
            type,
        }).then(value => value);

    }

    // hàm này để thêm 1 thông báo chuyển tiển
    static async addNotifyForTransfer(from,to){
        return this.create({
            from,
            to,
            type:1,
        }).then(value => value);
    }

    static async addNotifyForReceive(from,to){

        return this.create({
            from,
            to,
            type:2,
        }).then(value => value);
    }

    // hàm này để thêm 1 thông báo chuyển tiển khi staff thêm cho user
    static async addNotifyForStaffRecharge(from,to){
        return this.create({
            from,
            to,
            type:5,
        }).then(value => value);
    }

     // hàm này để lấy thông báo cho 1 user
    static async getNotification(find){
            return this.findAll({
                where:{
                    [Op.or]:[
                        {
                            from:find
                        },
                        {
                            to: find
                        }
                    ]
                },
                order:[
                    ['date','DESC']
                ]
            })
    }

    // // hàm này để lấy thông báo cho nhân viên
    // static async getNotificationForStafff(){
    //     return this.findAll({
    //         where:{
    //            type:5
    //         },
    //         order:[
    //             ['date','DESC']
    //         ]
    //     })
    // }

    // hhàm này để seen 1 thông báo
    static async seenNotification(id){
        const found = await this.findByPk({
            where:{
                id,
            }
        })

        if(found){
            found.seen = true;
            return found.save();
        }

        return null;
    }

}

Notification.init({
    //attributes
    from: { 
        type: Sequelize.STRING,
    },
    to: { 
        type: Sequelize.STRING,
    },
    type: {
        type: Sequelize.INTEGER,
        // type = 1: chuyen tien
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW(),
    },
    seen:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    }
}, {
    sequelize: db,
    modelName: 'notification',
})

module.exports = Notification;

