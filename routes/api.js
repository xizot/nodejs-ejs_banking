const express = require('express');
const router = express.Router();
const AccountInfo = require('../services/accountInfo');
const Transfer = require('../services/transfer');
const User = require('../services/user');
const bcrypt = require('bcrypt');

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


//[USER] 

router.post('/change-password', async (req, res)=>{
    const st = req.body.st;
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;

    if(st){
        const found = await User.findBySomeThing(st);
        if(found){
          
            if(await User.verifyPassword(password,found.password) || !found.password){
                if(newPassword === confirmPassword){
                    found.changePassword(newPassword);
                    return res.end('1'); // success
                }   
                return res.end('-3') // confirm password is not match
            }
            return res.end('-2') // password is not match
        }
        return res.end('-1'); // user not found
    }
})

router.get('/forgot-password', async (req, res)=>{
    const st = req.query.st;
    console.log(st);
    

    if(st){
      const rs = await User.forgotPassword(st);
          
      if(rs){
          return res.end(JSON.stringify(rs));
      }
      return res.end('da xay ra loi')
    }
    return res.end('khong hop le')
})

module.exports = router;