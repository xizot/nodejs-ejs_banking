const express = require('express');
const router = express.Router();
const exchangeRate = require('../services/exchangeRate');
const Bank = require('../services/bank');
const AccountInfo = require('../services/accountInfo');
var exchangeRates = [];
var banks = [];
const errors = [];


router.get('/', async (req, res) => {
    var io = req.app.get('socketio');
    exchangeRates = await exchangeRate.findAll();
    banks = await Bank.findAll();

    return res.render('transfer', { exchangeRates, banks, errors });
})

router.post('/', async (req, res) => {

    const txtMoney = req.body.txtMoney;
    const currencyUnit = req.body.currencyUnit;
    const bankCode = req.body.beneficiaryBank;
    const txtCardNumber = req.body.txtCardNumber;
    const txtMessage = req.body.txtMessage;
    const found = await AccountInfo.getBySTKAndBankCode(txtCardNumber, bankCode);
    if (found) {
        found.addMoney(req.currentUser.id, txtMoney, txtMessage, currencyUnit, bankCode);
        return res.json(found);
    }
})


module.exports = router;