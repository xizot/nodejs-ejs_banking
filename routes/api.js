const express = require('express');
const router = express.Router();
const AccountInfo = require('../services/accountInfo');
const Transfer = require('../services/transfer');
router.get('/account/info', async (req, res) => {
    if (req.currentUser) {
        var found = null;
        if (req.query.stk && req.query.bankCode) {
            found = await AccountInfo.getBySTKAndBankCode(req.query.stk, req.query.bankCode);
            return res.json(found);
        }
        found = await AccountInfo.getByUserID(req.currentUser.id);
        return res.json(found);
    }
    return res.redirect('/login');
})

// router.get('/account/info', async (req, res) => {
//     if (req.currentUser) {
//         const found = await AccountInfo.getByUserID(req.currentUser.id);
//         return res.json(found);
//     }
//     return res.redirect('/login');
// })


// router.get('/account/find', async (req, res) => {

// })

//add money with api
router.post('/account/addMoney', async (req, res) => {
    const accountInfo = await AccountInfo.getByUserID(req.currentUser.id);

    if (!accountInfo) {
        return res.end('-3'); // chuưa cập nhật tài khoản
    }

    const stk = req.body.stk;
    const bankCode = req.body.bankCode;
    var money = req.body.money;
    const message = req.body.message;
    const currencyUnit = req.body.currencyUnit;


    if (stk && bankCode) {
        const found = await AccountInfo.getBySTKAndBankCode(stk, bankCode);

        if (found) {
            if (found.userID == req.currentUser.id) {
                return res.end('-1'); // lỗi gửi tiền cho chính mình
            }
            if (currencyUnit == "VND") {
                money = money * (1 / 23000);
            }
            await found.addMoney(req.currentUser.id, money, message, currencyUnit, bankCode);
            return res.end('1'); // thanh cong
        }
        else {
            return res.end('0');
        }
    }

    return res.end('-2'); //Lỗi k cố định
})

//get info of transfer id with api

router.get('/transfer/:id', async (req, res) => {
    const { id } = req.params;
    const found = await Transfer.findByPk(id);
    console.log(found);
})


module.exports = router;