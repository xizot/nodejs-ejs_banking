const express = require('express');
const router = express.Router();
const AccountInfo = require('../services/accountInfo');
router.get('/account/info', async (req, res) => {
    if (req.currentUser) {
        const found = await AccountInfo.getByUserID(req.currentUser.id);
        return res.json(found);
    }
    return res.redirect('/login');
})

// router.get('/account/find', async (req, res) => {

// })

router.post('/account/addMoney', async (req, res) => {
    const stk = req.body.stk;
    const bankCode = req.body.bankCode;
    const money = req.body.money;
    const message = req.body.message;
    const currencyUnit = req.body.urrencyUnit;
    if (stk && bankCode) {
        const found = await AccountInfo.getBySTKAndBankCode(stk, bankCode);

        if (found) {
            if (found.userID == req.currentUser.id) {
                return res.end('-1'); // lỗi gửi tiền cho chính mình
            }

            console.log('da vao day');
            await found.addMoney(req.currentUser.id, money);
            return res.end('1');
        }
        else {
            return res.end('0');
        }
    }

    return res.end('-2'); //Lỗi k cố định
})


module.exports = router;