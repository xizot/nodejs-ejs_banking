const express = require("express");
const router = express.Router();
const io = require("socket.io-client");
const StaffActivityLog = require("../../services/staffActivityLog");
const User = require("../../services/user");
const Customer = require("../../services/customer");
const { CreateNewCreditCard, sendMail } = require("./../../services/function");

// const Transfer = require('../../services/transfer');
const UserRequest = require("../../services/userRequest");
const {
  ejectSavingAccount,
  acceptSavingAccount,
} = require("../../services/savingAccount");
// lấy tất cả yeeu caafu thông báo

let socket;
socket = io("https://dack-17ck1.herokuapp.com");

router.get("/", async (req, res) => {
  // 1: Xác thực tài khoản
  // 2: Tạo tài khoản ngân hàng
  // 3: Tạo tài khoản tiết kiệm
  // 4: yêu cầu khóa tài khoản
  //tim request xac minh tai khoan
  const found = await UserRequest.findAll({
    order: [["createdAt", "DESC"]],
  });
  const { id } = req.query;
  let data = null;
  let content = null;
  if (id) {
    content = await UserRequest.findByPk(id);
    if (content && content.type == 1) {
      data = await Customer.getByUserID(content.userID);
    }
  }
  return res.render("./staff-views/request", { found, data, id, content });
});

router.get("/create-credit-card", async (req, res) => {
  // 1: Xác thực tài khoản
  // 2: Tạo tài khoản ngân hàng
  // 3: Tạo tài khoản tiết kiệm
  // 4: yêu cầu khóa tài khoản
  //tim request xac minh tai khoan
  const found = await UserRequest.findByType(2);
  return res.render("verifyAccount", { found });
});

router.get("/create-saving-card", async (req, res) => {
  // 1: Xác thực tài khoản
  // 2: Tạo tài khoản ngân hàng
  // 3: Tạo tài khoản tiết kiệm
  // 4: yêu cầu khóa tài khoản
  //tim request xac minh tai khoan
  const found = await UserRequest.findByType(3);
  return res.render("verifyAccount", { found });
});

router.get("/block", async (req, res) => {
  // 1: Xác thực tài khoản
  // 2: Tạo tài khoản ngân hàng
  // 3: Tạo tài khoản tiết kiệm
  // 4: yêu cầu khóa tài khoản
  //tim request xac minh tai khoan
  const found = await UserRequest.findByType(4);
  return res.render("verifyAccount", { found });
});

router.get("/accept-request/:id", async (req, res) => {
  if (!req.currentUser | (!req.currentUser.permisstion == 1))
    return res.json(null);

  const { id } = req.params;
  if (!id) return res.json(null);
  const found2 = await UserRequest.findByPk(id);
  const found = await UserRequest.acceptRequest(id);
  let msg = null;

  if (!req.currentUser && req.currentUser.permisstion != 1) return null;

  if (found2) {
    if (found2.type == 1) {
      msg = `Xác thực tài khoản id ${found2.userID}`;
      const user = await User.findByPk(found2.userID);
      if (user) {
        user.isActive = 1;
        await user.save();
        sendMail(
          user.email,
          "Xác thực tài khoản thành công",
          "Tài khoản của bạn đã được xác thực. Bây giờ bạn có thể chuyển tiền",
          "Tài khoản của bạn đã được xác thực. Bây giờ bạn có thể chuyển tiền"
        );
      }
    }
    if (found2.type == 2) {
      const user = await User.findByPk(found2.userID);
      msg = `Mở tài khoản ngân hàng cho id ${found2.userID}`;
      if (user) {
        await CreateNewCreditCard(found2.userID, user.displayName);

        if (user) {
          sendMail(
            user.email,
            "Tài khoản thanh toán",
            "Nhân viên vừa chấp thuận yêu cầu tạo tài khoản thanh toán của bạn",
            "Nhân viên vừa chấp thuận yêu cầu tạo tài khoản thanh toán của bạn"
          );
        }
      }
    }
    if (found2.type == 3) {
      const user = await User.findByPk(found2.userID);
      msg = `Mở tài khoản tiết kiệm cho id ${found2.userID}`;
      await acceptSavingAccount(found2.userID);
      if (user) {
        sendMail(
          user.email,
          "Tài khoản tiết khiệm",
          "Nhân viên vừa chấp thuận yêu cầu tạo tài khoản tiết kiệm của bạn",
          "Nhân viên vừa chấp thuận yêu cầu tạo tài khoản tiết kiệm của bạn"
        );
      }
    }
    if (found2.type == 4) {
      msg = ` Khóa tài khoản id ${found2.userID}`;
    }
  }
  const newActivity = await StaffActivityLog.create({
    staffID: req.currentUser.id,
    message: msg,
  });

  return res.json(found);
});

router.get("/eject-request/:id", async (req, res) => {
  if (!req.currentUser | (!req.currentUser.permisstion == 1))
    return res.json(null);
  const { id } = req.params;
  if (!id) return res.json(null);
  let msg = null;
  const found2 = await UserRequest.findByPk(id);
  const deleted = await UserRequest.destroy({
    where: {
      id,
    },
  });

  if (found2.type == 1) {
    msg = `Từ chối xác thực tài khoản id ${found2.userID}`;
    await User.update(
      {
        isActive: -2,
      },
      {
        where: {
          id: found2.userID,
        },
      }
    );
    socket.emit("transfer", "me");
  }
  if (found2.type == 2) {
    msg = `Từ chối mở tài khoản ngân hàng cho id ${found2.userID}`;
  }
  if (found2.type == 3) {
    msg = `Từ chối mở tài khoản tiết kiệm cho id ${found2.userID}`;
    const rs = await ejectSavingAccount(found2.userID);
  }
  if (found2.type == 4) {
    msg = `Từ chối khóa tài khoản id ${found2.userID}`;
  }
  const newActivity = await StaffActivityLog.create({
    staffID: req.currentUser.id,
    message: msg,
  });

  return res.json(deleted);
});

// tim thong tin xac minh cua 1 userid by id
router.get("/verify-account-id/:id", async (req, res) => {
  const { id } = req.params;
  if (id) {
    const found = await UserRequest.findByPk(id);

    if (found) {
      const VerifyInfo = await Customer.getByUserID(found.userID);
      return res.json(VerifyInfo);
    }
  }
  return res.json(null);
});

module.exports = router;
