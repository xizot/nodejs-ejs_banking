const Sequelize = require("sequelize");
const db = require("./db");
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
  static async addPrevent(fromUser, toUser, type) {
    return this.create({
      fromUser,
      toUser,
      type,
    }).then((value) => value);
  }

  // hàm này để thêm 1 thông báo chuyển tiển
  static async addNotifyForTransfer(from, to, fromUserID, toUserID) {
    return this.create({
      from,
      to,
      fromUser: fromUserID,
      toUser: toUserID,
      type: 1,
    }).then((value) => value);
  }

  static async addNotifyForReceive(from, to, fromUserID, toUserID) {
    return this.create({
      from,
      to,
      fromUser: fromUserID,
      toUser: toUserID,
      type: 2,
    }).then((value) => value);
  }

  // hàm này để thêm 1 thông báo chuyển tiển khi staff thêm cho user
  static async addNotifyForStaffRecharge(from, to) {
    return this.create({
      from,
      to,
      type: 5,
    }).then((value) => value);
  }

  // hàm này để lấy thông báo cho 1 user
  static async getNotification(find) {
    return this.findAll({
      where: {
        [Op.or]: [
          {
            fromUser: find,
          },
          {
            toUser: find,
          },
        ],
      },
      order: [["id", "DESC"]],
    });
  }

  // Lấy số lượng thông báo chưa đọc
  static async countNotification(find) {
    return this.count({
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              {
                fromUser: find,
              },
              {
                [Op.or]: [
                  {
                    seen: 3,
                  },
                  {
                    seen: 0,
                  },
                ],
              },
            ],
          },
          {
            [Op.and]: [
              {
                toUser: find,
              },
              {
                [Op.or]: [
                  {
                    seen: 2,
                  },
                  {
                    seen: 0,
                  },
                ],
              },
            ],
          },
        ],
      },
      order: [["date", "DESC"]],
    });
  }

  // Người gửi đã xem seen: 2
  // Người nhận đã xem seen: 3
  // cả 2 đã xem: seen 1
  // chưa ai xem seen: 0

  // hhàm này để seen 1 thông báo
  static async seenNotification(id, userID) {
    const found = await Notification.findByPk(id);
    if (found) {
      if (found.from == "ADMIN" || (!found.fromUser && !found.toUser)) {
        found.seen = 1;
        return found.save();
      }
      if (found.fromUser == userID) {
        if (found.seen == 0) {
          found.seen = 2;
        } else {
          found.seen = 1;
        }
        return found.save();
      }

      if (found.toUser == userID) {
        if (found.seen == 0) {
          found.seen = 3;
        } else {
          found.seen = 1;
        }
        return found.save();
      }
    }

    return null;
  }
}

Notification.init(
  {
    //attributes
    from: {
      type: Sequelize.STRING,
    },
    to: {
      type: Sequelize.STRING,
    },
    fromUser: {
      type: Sequelize.INTEGER,
    },
    toUser: {
      type: Sequelize.INTEGER,
    },
    type: {
      type: Sequelize.INTEGER,
      // type = 1: chuyen tien
    },
    date: {
      type: Sequelize.DATEONLY,
      defaultValue: Sequelize.NOW(),
    },
    seen: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize: db,
    modelName: "notification",
  }
);

module.exports = Notification;
