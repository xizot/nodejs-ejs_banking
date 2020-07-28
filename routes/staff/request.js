const express = require('express');
const router = express.Router();

const StaffActivityLog = require('../../services/staffActivityLog');
const User = require('../../services/user');
const Customer = require('../../services/customer');
const { CreateNewCreditCard } = require('./../../services/function');

// const Transfer = require('../../services/transfer');
const UserRequest = require('../../services/userRequest');
// lấy tất cả yeeu caafu thông báo
router.get('/', async (req, res) => {
    // 1: Xác thực tài khoản
    // 2: Tạo tài khoản ngân hàng
    // 3: Tạo tài khoản tiết kiệm
    // 4: yêu cầu khóa tài khoản
    //tim request xac minh tai khoan
    const found = await UserRequest.findAll({
        order: [
            ['createdAt', 'DESC']
        ]
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
    return res.render('request', { found, data, id, content });
})

router.get('/create-credit-card', async (req, res) => {
    // 1: Xác thực tài khoản
    // 2: Tạo tài khoản ngân hàng
    // 3: Tạo tài khoản tiết kiệm
    // 4: yêu cầu khóa tài khoản
    //tim request xac minh tai khoan
    const found = await UserRequest.findByType(2);
    return res.render('verifyAccount', { found });
})

router.get('/create-saving-card', async (req, res) => {
    // 1: Xác thực tài khoản
    // 2: Tạo tài khoản ngân hàng
    // 3: Tạo tài khoản tiết kiệm
    // 4: yêu cầu khóa tài khoản
    //tim request xac minh tai khoan
    const found = await UserRequest.findByType(3);
    return res.render('verifyAccount', { found });
})

router.get('/block', async (req, res) => {
    // 1: Xác thực tài khoản
    // 2: Tạo tài khoản ngân hàng
    // 3: Tạo tài khoản tiết kiệm
    // 4: yêu cầu khóa tài khoản
    //tim request xac minh tai khoan
    const found = await UserRequest.findByType(4);
    return res.render('verifyAccount', { found });
})

router.get('/accept-request/:id', async (req, res) => {
    if (!req.currentUser | !req.currentUser.permisstion == 1) return null;

    const { id } = req.params;
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
                user.save();
            }
        }
        if (found2.type == 2) {
            const user = await User.findByPk(found2.userID);
            msg = `Mở tài khoản ngân hàng cho id ${found2.userID}`;
            if (user)
                await CreateNewCreditCard(found2.userID, user.displayName);
        }
        if (found2.type == 3) {
            msg = `Mở tài khoản tiết kiệm cho id ${found2.userID}`;
        }
        if (found2.type == 4) {
            msg = ` Khóa tài khoản id ${found2.userID}`;
        }
    }
    const newActivity = await StaffActivityLog.create({
        staffID: req.currentUser.id,
        message: msg,
    })

    return res.json(found);
})



// tim thong tin xac minh cua 1 userid by id
router.get('/verify-account-id/:id', async (req, res) => {

    const { id } = req.params;
    if (id) {
        const found = await UserRequest.findByPk(id);

        if (found) {
            const VerifyInfo = await Customer.getByUserID(found.userID);
            return res.json(VerifyInfo);
        }

    }
    return res.json(null);

})



module.exports = router;