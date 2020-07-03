const express = require('express');
const router = express.Router();
const requestCreditCard = require('../services/requestCreateCreditCard');


router.get('/', async (req, res) => {
    const id = req.currentUser.id || null;
    if (id) {
        requestCreditCard.sendRequest(id);
    }
    return res.render('alert/alert', { title: 'Payyed - Create Credit', msg: 'Đã gửi yêu cầu tạo tài khoản. Nhân viên sẽ phản hồi lại sau <a href="/">Ấn vào đây để quay lại</a>' });
})



module.exports = router;