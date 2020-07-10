const express = require('express');
const router = express.Router();
const AccountInfo = require('../services/accountInfo');
const Transfer = require('../services/transfer');
const User = require('../services/user');
const bcrypt = require('bcrypt');


router.get('/current', async (req, res) => {
    if (req.currentUser) {
        return res.json(req.currentUser);
    }
    return res.json(null);

})


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

// [TRANSFER]
router.get('/transfer/activity', async (req,res)=>{

    const {id, page,limit,fromDate, toDate} = req.body;

    //Date có dạng: MM/dd/yyyy
   const found = await Transfer.getActivityByDate(1,0,5,"01/01/2012","7/03/2020");

   if(!found) return null;

   return res.json(found);
})



// Liên ngân hàng {TRANSFER}
router.post('/checkaccountid',async (req,res)=>{
    // null: không tồn tại tài khoản đó
    // 0: thành công, có tồn tại
    // 1: mã bankId hoặc bannkSecretKey gửi không phù hợp với cái mà Nhật cấp cho tụi t từ trước (cái này tụi t lưu DB)
    // 2: không đủ dữ liệu
    const {accountId,bankSecretKey, bankId,clientId,secretKey} = req.body;
    if(!accountId || !bankSecretKey || !bankId || !clientId || !secretKey)  return res.json(2);
    
    if(clientId !== "wibu" || secretKey !== "36dc50f6-65e5-47c5-80ff-f6dbd8cd3dee") return res.json(null);

    if(bankSecretKey != "12345" || bankId != "wfb") return res.json(1); 

    const found = await AccountInfo.getBySTKOne(accountId);
    if(found) return res.json(0);
    if(!found) return res.json(null);
    
    return res.json(null);
})

router.post('/transferexternal',async (req,res)=>{

    //   null: không tồn tại tài khoản đó
    //0: nhận tiền thành công
    //1: mã bankId hoặc bannkSecretKey gửi không phù hợp với cái mà Nhật cấp cho tụi t từ trước (cái này tụi t lưu DB)
    //2: loại tiền không hợp lệ (chỉ nhận USD hoặc VND)
    //3: có lỗi ngoài lề nào đó, bên Nhật nhận tín hiệu này thì hoãn tiền lại cho tài khoản bên gửi
    //4: không đủ dữ liệu

    // clientId: bên wfb cung cấp cho bên Nhật cái này để gọi được api bên t
    // secretKey: bên wfb cung cấp cho nhật cái này để gọi được api bên t


    const {accountId,bankSecretKey, bankId,money,currency,requestAccountId,clientId,secretKey} = req.body;
    if(!accountId || !bankSecretKey || !bankId || !money || !currency || !requestAccountId || !clientId || !secretKey)  return res.json(4);

    
   

    // kiểm tra hợp lê
    if(bankSecretKey != "12345" || bankId != "wfb") return res.json(1); 

    // loại tiền tệ không được chấp nhận
    if(currency != "VND" && currency != "USD") return res.json(2); 

    // tìm tài khoản thụ hưởng
    const found = await AccountInfo.getBySTKOne(accountId);

    //nếu không tìm thấy
    if(!found) return res.json(null);


    const message = req.body.message || "Đã có 1 người chuyển tiền cho bạn";

    // Chuyển tiền thành công
    if(await found.addMoneyExternal(requestAccountId,money,message,currency,bankId)) return res.json(0);


    await AccountInfo.minusMoney(to,money,currency,bankId);
    //Đã xảy ra lỗi gì đó
    Transfer.addError(requestAccountId,accountId);
    return res.json(3);
})

//add money with api
router.post('/transferinternal', async (req, res) => {

    /*
       null: không thành công
       0: thành công
       1: không đầy đủ thông tin
       2: không tìm thấy tài khoản người nhận
       3: ngân hàng không hợp lệ 
       4: đã xảy ra lỗi gì đó
       5: không tìm thấy tài khoản người gửi
       6: Loại tiền không hợp lệ
       7: người gửi không đủ tiền
   */

   if(!req.body.from && !req.currentUser) return res.json(null);
   const from = req.body.from || req.currentUser.id ;

   const {to,bankCode,money,message,currencyUnit} = req.body;

  

   if(!from || !to || !bankCode || !money || !currencyUnit) return res.json(1);
   if(bankCode !== "ARG") return res.json(3);
   if(currencyUnit !== "VND" && currencyUnit !="USD") return res.json(6);

   const found = await AccountInfo.getBySTKOne(to);
   if(!found) return res.json(2);

   const rs = await AccountInfo.addMoneyInternal(from,to,money,message,currencyUnit,bankCode).then(value => value);
   return res.json(rs);
   

   return res.json(4);
})

router.post('/transferinternal1', async (req, res) => {

    return res.json(req.body);

})




module.exports = router;