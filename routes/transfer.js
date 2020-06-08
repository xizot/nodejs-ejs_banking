const express = require('express');
const router = express.Router();
const exchangeRate = require('../services/exchangeRate');
const Bank = require('../services/bank');
const AccountInfo = require('../services/accountInfo');
const exchangeRates = [];
const banks = [];
const errors = [];


router.get('/', async function(req, res) {
    return res.end('done');
    // exchangeRates = await exchangeRate.findAll();
    // banks = await Bank.findAll();
    // kho hieu vl @@
    // console.log(banks);
    // console.log(exchangeRates);
    // return res.render('transfer', { exchangeRates, banks, errors:errors });
})

router.post('/', async (req, res) => {

    const txtMoney = req.body.txtMoney;
    const currencyUnit = req.body.currencyUnit;
    const bankCode = req.body.beneficiaryBank;
    const txtCardNumber = req.body.txtCardNumber;
    const txtMessage = req.body.txtMessage;


    const found = await AccountInfo.getBySTKAndBankCode(txtCardNumber, bankCode);
    if (found) {
        found.addMoney(txtMoney);
        return res.json(found);
    }

    console.log(req.body);
})


module.exports = router;