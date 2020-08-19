const express = require("express");
const router = express.Router();
const { sendRequest } = require("../services/userRequest");
const io = require("socket.io-client");
let socket;
socket = io("https://dack-17ck1.herokuapp.com");

router.get("/", async (req, res) => {
  if (!req.currentUser) return res.redirect("/login");

  if (!req.currentUser.email && req.currentUser.permisstion == 0)
    return res.redirect("/add-mail");

  if (req.currentUser.token && req.currentUser.permisstion == 0)
    return res.redirect("/active");
  if (req.currentUser.isActive == 5) return res.redirect("/alert/blocked");

  const id = req.currentUser.id || null;

  const rs = await sendRequest(req.currentUser.id, 2);
  if (rs === 1) {
    return res.render("alert/alert", {
      title: "Payyed - Create Credit",
      msg:
        'Bạn đã gửi yêu cầu trước đó, vui lòng đợi nhân viên kiểm tra <a href="/">Ấn vào đây để quay lại</a>',
    });
  }

  if (rs) {
    socket.emit("add-new-noti", "me");
    return res.render("alert/alert", {
      title: "Payyed - Create Credit",
      msg:
        'Đã gửi yêu cầu tạo tài khoản ngân hàng thành công. Nhân viên sẽ phản hồi lại sau <a href="/">Ấn vào đây để quay lại</a>',
    });
  }

  return res.render("alert/alert", {
    title: "Payyed - Create Credit",
    msg: 'Đã xảy ra lỗi <a href="/">Ấn vào đây để quay lại</a>',
  });
});

module.exports = router;
