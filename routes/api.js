const express = require('express');
const router = express.Router();
const AccountInfo = require('../services/accountInfo');
const Transfer = require('../services/transfer');
const User = require('../services/user');
const StaffActivityLog = require('../services/staffActivityLog');
const Notifications = require('../services/notification');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { sendMail } = require('../services/function');
const { findInfoOffCustomer, findActivityStaff, countActivityStaff } = require('../services/staffFunction');
const UserRequest = require('../services/userRequest');
const io = require('socket.io-client');
const SavingAccount = require('../services/savingAccount');
const { use } = require('./forgotPassword');
const Customer = require('../services/customer');
let socket;
socket = io("https://dack-17ck1.herokuapp.com");

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


//add money with api
router.post('/account/addMoney', async (req, res) => {
    const { stk, bankCode, money, from, message, currencyUnit } = req.body;
    const fee = req.body.fee || 0;
    if (from != "ADMIN") {

        const accountInfo = await AccountInfo.getByUserID(req.currentUser.id);

        if (!accountInfo) {
            return res.end('-3'); // chuưa cập nhật tài khoản
        }
    }
    if (stk && bankCode) {

        if (from != "ADMIN") {
            const dup = await AccountInfo.getByUserID(req.currentUser.id);

            if (dup && dup.STK == stk) {
                return res.end('-1')
            }
        }
        const found = await AccountInfo.getBySTKAndBankCode(stk, bankCode);

        if (found) {

            const rs = await AccountInfo.addMoneyInternal(from, stk, money, message, currencyUnit, bankCode, req.currentUser.id, fee)
            // lấy thông tin người nhận
            if (rs == 8) return res.json(8)
            if (rs == 2) return res.json(2)
            if (rs == 7) return res.json(7)

            const ToInfo = await User.findByPk(found.userID);
            if (ToInfo) {
                const accountInfo1 = await AccountInfo.getBySTKOne(stk);

                sendMail(ToInfo.email, 'Nhận tiền', `Bạn vừa được nhận tiền thành công:\n
                STK gửi: ${from} \n
                STK nhận: ${stk} \n
                Tiền đã nhận: ${money} ${currencyUnit} \n
                Lời nhắn: ${message} \n
                Số dư: ${accountInfo1.balance}\n
                Cảm ơn bạn đã tin tưởng,\n
                Payyed.

            `, `<h3 style="color:#333; text-transform:uppercase; text-align:center; font-size:30px; font-family:Tahoma,Arial,Helvetica,sans-serif">Bạn vừa được nhận tiền thành công:<h3>
            <div style="padding:20px;background-color:#f1f5f6; border-radius:10px;margin:30px;font-family:Tahoma,Arial,Helvetica,sans-serif; font-size:14px;color:#333">
              <p>STK gửi:<b> ${from} </b></p> 
              <p>STK nhận:<b> ${stk}  </b></p>
              <p>Tiền đã nhận:<b> ${money} ${currencyUnit} </b></p>
              <p>Lời nhắn:<b> ${message}  </b></p>
              <p>Số dư:<b> ${accountInfo1.balance}  </b></p>
              <p style="margin:20px 0 0">Cảm ơn bạn đã tin tưởng,</p>
              <p style="font-size:18px; margin-top:5px">Pa<span style="color:#29ad57; font-weight:bold">yy</span>ed.</p>
            </div>
        `)

                if (from != "ADMIN") {
                    const accountInfo = await AccountInfo.getByUserID(req.currentUser.id);
                    sendMail(req.currentUser.email, 'Chuyển tiền', `Bạn vừa chuyển tiền thành công:\n
                    STK gửi: ${from} \n
                    STK nhận: ${stk} \n
                    Tiền đã gửi: ${money} ${currencyUnit} \n
                    Phí gửi tiền: ${fee} USD \n
                    Lời nhắn: ${message} \n
                    Số dư: ${accountInfo.balance} \n
                    Cảm ơn bạn đã tin tưởng,\n
                    Payyed.

                `, `<h3 style="color:#333; text-transform:uppercase; text-align:center; font-size:30px; font-family:Tahoma,Arial,Helvetica,sans-serif">Bạn vừa chuyển tiền thành công:<h3>
                <div style="padding:20px;background-color:#f1f5f6; border-radius:10px;margin:30px;font-family:Tahoma,Arial,Helvetica,sans-serif; font-size:14px;color:#333">
                  <p>STK gửi:<b> ${from} </b></p> 
                  <p>STK nhận:<b> ${stk} </b></p>
                  <p>Tiền đã gửi:<b> ${money} ${currencyUnit}  </b></p>
                  <p>Phí gửi tiền:<b> ${fee} USD </b></p>
                  <p>Lời nhắn:<b> ${message} </b></p>
                  <p>Số dư:<b> ${accountInfo.balance} </b></p>
                  <p style="margin:20px 0 0">Cảm ơn bạn đã tin tưởng,</p>
                  <p style="font-size:18px; margin-top:5px; font-weight:bold">Pa<span style="color:#29ad57">yy</span>ed.</p>
                </div>
            `)
                }
                else {
                    await StaffActivityLog.create({
                        staffID: req.currentUser.id,
                        message: `Đã nạp tiền cho số tài khoản ${stk} số tiền ${money} ${currencyUnit}`,
                    })
                }
            }

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
})

router.get('/get-all-transfer', async (req, res) => {
    const { stk, page, fromDate, toDate } = req.body
    const limit = 10;

    if (!stk || !page || !fromDate || !toDate) return res.json(null);

    const found = await Transfer.getActivityByDate(stk, page, limit, fromDate, toDate);
    return res.json(found)
})


//[USER] 
router.post('/change-password', async (req, res) => {
    const st = req.body.st;
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;

    if (st) {
        const found = await User.findBySomeThing(st);
        if (found) {

            if (await User.verifyPassword(password, found.password) || !found.password) {
                if (newPassword === confirmPassword) {
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

router.get('/forgot-password', async (req, res) => {
    const st = req.query.st;
    if (st) {
        const rs = await User.forgotPassword(st);
        if (rs) {
            return res.end(JSON.stringify(rs));
        }
        return res.end('da xay ra loi')
    }
    return res.end('khong hop le')
})

router.post('/update-info', async (req, res) => {

    if (!req.currentUser) return null;
    const { displayName, email, username, address, dob, phoneNumber } = req.body;
    const found = await User.findByPk(req.currentUser.id);;
    if (!found) return 3; // khong tim thay


    if (await User.checkDEmail(req.currentUser.id, email)) return res.json(4) // email da ton tai
    if (await User.checkDUsername(req.currentUser.id, username)) return res.json(5) // username da ton tai

    found.displayName = displayName;
    found.email = email;
    found.username = username;
    found.address = address;
    found.dob = dob;
    found.phoneNumber = phoneNumber;
    await AccountInfo.update({
        displayName: displayName
    }, {
        where: {
            userID: req.currentUser.id
        }
    })
    await found.save();
    return res.json(found);
})

router.get('/resend-code-register', async (req, res) => {
    const token = crypto.randomBytes(3).toString('hex').toUpperCase();
    const found = await User.findByPk(req.currentUser.id);
    if (!found) return res.json(null);
    found.token = token;
    found.save();
    sendMail(req.currentUser.email, 'Mã kích hoạt', token, token);
    return res.json(1)
})

router.get('/resend-code-forgotpassword', async (req, res) => {
    const code = crypto.randomBytes(3).toString('hex').toUpperCase();

    const found = await User.findByEmail(req.session.fgEmail);
    if (!found) return res.json(null);
    found.forgotCode = code;
    found.save();
    sendMail(req.session.fgEmail, 'Quên mật khẩu', code, code);
    return res.json(1)
})
// [TRANSFER]
router.post('/transfer/activity', async (req, res) => {
    const { fromDate, toDate } = req.body;
    const userID = req.currentUser.id;
    const page = req.body.page || 1;
    const limit = 7;


    const foundAccount = await AccountInfo.getByUserID(userID);
    if (!foundAccount) return res.json(2) // chuaw set mac dinh hoac chua co tai khoan

    const found = await Transfer.getActivityByDate(foundAccount.STK, page, limit, fromDate, toDate);
    if (!found) return res.json(null);
    return res.json(found);
})
router.post('/transfer-count-activity', async (req, res) => {
    if (!req.currentUser) return res.json(0);

    const { fromDate, toDate } = req.body;
    const foundAccount = await AccountInfo.getByUserID(req.currentUser.id);
    if (!foundAccount) return res.json(2) // chuaw set mac dinh hoac chua co tai khoan
    const count = await Transfer.countActivity(foundAccount.STK, fromDate, toDate);
    return res.json(count);
})
// Liên ngân hàng {TRANSFER}
router.post('/checkaccountid', async (req, res) => {
    // null: không tồn tại tài khoản đó
    // 0: thành công, có tồn tại
    // 1: mã bankId hoặc bannkSecretKey gửi không phù hợp với cái mà Nhật cấp cho tụi t từ trước (cái này tụi t lưu DB)
    // 2: không đủ dữ liệu
    const { accountId, bankSecretKey, bankId, clientId, secretKey } = req.body;
    if (!accountId || !bankSecretKey || !bankId || !clientId || !secretKey) return res.json(2);
    if (clientId !== "wibu" || secretKey !== "36dc50f6-65e5-47c5-80ff-f6dbd8cd3dee") return res.json(null);
    if (bankSecretKey != "12345" || bankId != "wfb") return res.json(1);
    const found = await AccountInfo.getBySTKOne(accountId);
    if (found) return res.json(0);
    if (!found) return res.json(null);
    return res.json(null);
})
router.post('/listen-external', async (req, res) => {

    //   null: không tồn tại tài khoản đó
    //0: nhận tiền thành công
    //1: mã bankId hoặc bannkSecretKey gửi không phù hợp với cái mà Nhật cấp cho tụi t từ trước (cái này tụi t lưu DB)
    //2: loại tiền không hợp lệ (chỉ nhận USD hoặc VND)
    //3: có lỗi ngoài lề nào đó, bên Nhật nhận tín hiệu này thì hoãn tiền lại cho tài khoản bên gửi
    //4: không đủ dữ liệu
    //5: không đúnng clientID
    // clientId: bên wfb cung cấp cho bên Nhật cái này để gọi được api bên t
    // secretKey: bên wfb cung cấp cho nhật cái này để gọi được api bên t
    const { clientid, secretkey } = req.headers;
    if (!clientid || !secretkey || clientid != "wibu" || secretkey != "0263baf607bec5531849") return res.json(5);
    const { accountId, bankSecretKey, bankId, money, currency, requestAccountId } = req.body;
    if (!accountId || !bankSecretKey || !bankId || !money || !currency || !requestAccountId) return res.json(4);
    // kiểm tra hợp lê
    if (bankSecretKey != "12345" || bankId != "wfb") return res.json(1);
    // loại tiền tệ không được chấp nhận
    if (currency != "VND" && currency != "USD") return res.json(2);
    // tìm tài khoản thụ hưởng
    const found = await AccountInfo.getBySTKOne(accountId);
    //nếu không tìm thấy
    if (!found) return res.json(null);
    const message = req.body.message || "Đã có 1 người khác ngân hàng chuyển tiền cho bạn";
    // Chuyển tiền thành công
    if (await found.addMoneyExternal(requestAccountId, money, message, currency, bankId)) {
        socket.emit('transfer', 'me')
        return res.json(0);
    }
    await AccountInfo.minusMoney(accountId, money, currency, bankId);
    //Đã xảy ra lỗi gì đó
    Transfer.addError(requestAccountId, accountId);
    return res.json(3);
})
// Chuyển tiền cùng ngân hàng
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
    if (!req.body.from && !req.currentUser) return res.json(null);
    const from = req.body.from || req.currentUser.id;

    const { to, bankCode, money, message, currencyUnit } = req.body;
    if (!from || !to || !bankCode || !money || !currencyUnit) return res.json(1);
    if (bankCode !== "ARG") return res.json(3);
    if (currencyUnit !== "VND" && currencyUnit != "USD") return res.json(6);

    const found = await AccountInfo.getBySTKOne(to);
    if (!found) return res.json(2);

    const rs = await AccountInfo.addMoneyInternal(from, to, money, message, currencyUnit, bankCode).then(value => value);
    return res.json(rs);
})
router.post('/transferinternal1', async (req, res) => {
    return res.json(req.body);
})

//STAFF
// tìm kiếm thông tin của 1 user by keyword( id, username, email, phonenumber, stk) ->  trả về thông tin user
router.post('/customer-search', async (req, res) => {
    const { st } = req.body;
    return res.json(await findInfoOffCustomer(st));
})
router.get('/get-activity', async (req, res) => {
    if (!req.currentUser) return null
    const numpage = req.query.numpage || 1;
    const limit = 10;
    const found = await findActivityStaff(req.currentUser.id, numpage, limit);
    return res.json(found);
})
router.get('/count-activity', async (req, res) => {
    if (!req.currentUser) return res.json(0);
    const count = await countActivityStaff(req.currentUser.id);
    return res.json(count);
})

// [ACCOUNT]

router.get('/account-get-limit', async (req, res) => {
    if (!req.currentUser) return res.json(null);
    const found = await AccountInfo.findOne({
        where: {
            userID: req.currentUser.id
        }
    })
    if (!found) return res.json(null);
    return res.json(found.limit);
})
router.post('/account-change-limit', async (req, res) => {
    if (!req.currentUser) return res.json(null);

    const { limit } = req.body;
    if (!limit) res.json(null);

    const found = await AccountInfo.update({
        limit
    }, {
        where: {
            userID: req.currentUser.id
        }
    })
    if (!found) return res.json(null);
    return res.json(1);
})


router.get('/account/infor', async (req, res) => {
    if (!req.currentUser) return null;
    const found = await AccountInfo.findAll({
        where: {
            userID: req.currentUser.id
        },
        order: [['createdAt', 'DESC']]
    })

    return res.json(found);
})
router.post('/set-default', async (req, res) => {
    const { stk, userID } = req.body;

    await AccountInfo.update({
        isDefault: false
    }, {
        where: {
            userID,
        }
    })

    const rs = await AccountInfo.update({
        isDefault: true
    }, {
        where: {
            STK: stk,
            userID
        }
    })

    return res.json(rs)

})
router.get('/get-account-default', async (req, res) => {
    if (!req.currentUser.id) return res.json(null);
    const found = await AccountInfo.getByUserID(req.currentUser.id);
    return res.json(found);
})
router.get('/get-all', async (req, res) => {
    const found = await AccountInfo.findAll();
    return res.json(found)
})

//security
router.post('/two-step-verification', async (req, res) => {
    const { password } = req.body;
    const found = await User.findByPk(req.currentUser.id);
    if (await User.verifyPassword(password, found.password)) {
        return res.json(1);
    }
    return res.json(null)
})

router.get('/sendcode-verification', async (req, res) => {

    const code = crypto.randomBytes(3).toString('hex').toUpperCase();
    sendMail(req.currentUser.email, 'Mã xác thực chuyển tiền', code, code);
    return res.json(code);
})



// [NOTIFICATION]

router.get('/notification', async (req, res) => {
    if (!req.currentUser) return res.json(null); // chua dang nhap
    const userID = req.currentUser.id;
    const found = await Notifications.getNotification(userID);
    let rs = [];
    if (found.length > 0) {
        found.map(item => {
            if (item.type == 1 && item.toUser == userID) {
                rs.push({
                    id: item.id,
                    type: item.type,
                    msg: `Tài khoản ${item.to} của bạn vừa nhận được tiền từ ${item.from}`,
                    seen: item.seen == 0 ? false : item.seen == 1 ? true : item.seen == 3 ? true : false,
                })
            } else if (item.type == 1 && item.fromUser == userID) {
                rs.push({
                    id: item.id,
                    type: item.type,
                    msg: `Bạn đã chuyển tiền cho ${item.to}`,
                    seen: item.seen
                })
            }
        })
    }
    return res.json(rs);
})

router.get('/count-notification', async (req, res) => {
    if (!req.currentUser) return res.json(null); // chua dang nhap
    const userID = req.currentUser.id;
    const count = await Notifications.countNotification(userID);

    if (!count) return res.json(0);

    return res.json(count);
})


//staff
router.get('/count-client', async (req, res) => {
    // if (!req.currentUser || req.currentUser.permisstion != 1) return res.json(null);
    const page = req.query.page || 1;
    const limit = 6;
    const listUser = await User.countClient()
    if (!listUser) return res.json(0);
    return res.json(listUser);
})
router.get('/get-client', async (req, res) => {
    // if (!req.currentUser || req.currentUser.permisstion != 1) return res.json(null);
    const page = req.query.page || 1;
    const limit = 6;
    const listUser = await User.getClient(page, limit)
    return res.json(listUser);
})
router.get('/get-client-info', async (req, res) => {
    if (!req.currentUser || req.currentUser.permisstion != 1) return res.json(null);
    const id = req.query.id;
    const user = await User.findByPk(id);
    return res.json(user);
})
router.post('/verify-client', async (req, res) => {
    if (!req.currentUser || req.currentUser.permisstion != 1) return res.json(null);
    const id = req.body.id;

    if (!id) return res.json(null)
    const user = await User.findByPk(id);
    if (!user) return res.json(null)
    // theem staff activity

    user.isActive = 1;
    await user.save();

    await StaffActivityLog.create({
        staffID: req.currentUser.id,
        message: `Đã xác thực tài khoản ${id}`,
    })

    sendMail(user.email, 'Tài khoản đã được xác thực', 'Nhân viên đã xác thực tài khoản của bạn', 'Nhân viên đã xác thực tài khoản của bạn')
    //gui thong bao qua mail cho user

    return res.json(1);
})

router.post('/block-client', async (req, res) => {
    if (!req.currentUser || req.currentUser.permisstion != 1) return res.json(null);
    const id = req.body.id;

    if (!id) return res.json(null)
    const user = await User.findByPk(id);
    if (!user) return res.json(null)

    user.isActive = 5;
    await user.save();

    await StaffActivityLog.create({
        staffID: 1 || req.currentUser.id,
        message: `Đã khóa tài khoản ${id}`,
    })

    sendMail(user.email, 'Tài khoản đã bị khóa', 'Nhân viên đã khóa tài khoản của bạn', 'Nhân viên đã khóa tài khoản của bạn')
    //gui thong bao qua mail cho user

    return res.json(1);
})

router.post('/unverify-client', async (req, res) => {
    if (!req.currentUser || req.currentUser.permisstion != 1) return res.json(null);
    const id = req.body.id;

    if (!id) return res.json(null)
    const user = await User.findByPk(id);
    if (!user) return res.json(null)
    // theem staff activity

    user.isActive = 0;
    await user.save();

    await StaffActivityLog.create({
        staffID: req.currentUser.id,
        message: `Đã hủy xác thực tài khoản ${id}`,
    })

    sendMail(user.email, 'Tài khoản đã bị hủy xác thực', 'Nhân viên đã hủy thực tài khoản của bạn', 'Nhân viên đã hủy xác thực tài khoản của bạn')
    //gui thong bao qua mail cho user

    return res.json(1);
})

router.post('/unblock-client', async (req, res) => {
    if (!req.currentUser || req.currentUser.permisstion != 1) return res.json(null);
    const id = req.body.id;

    if (!id) return res.json(null)
    const user = await User.findByPk(id);
    if (!user) return res.json(null)

    user.isActive = 0;
    await user.save();

    await StaffActivityLog.create({
        staffID: req.currentUser.id,
        message: `Đã mở khóa tài khoản ${id}`,
    })

    sendMail(user.email, 'Tài khoản đã được mở khóa', 'Nhân viên đã mở khóa tài khoản của bạn', 'Nhân viên đã mở khóa tài khoản của bạn')
    //gui thong bao qua mail cho user

    return res.json(1);
})
router.post('/delete-client', async (req, res) => {
    if (!req.currentUser || req.currentUser.permisstion != 1) return res.json(null);
    const id = req.body.id;

    if (!id) return res.json(null)
    const user = await User.destroy({
        where: {
            id: id,
        }
    });

    await StaffActivityLog.create({
        staffID: req.currentUser.id,
        message: `Đã xóa tài khoản ${id}`,
    })

    sendMail(user.email, 'Tài khoản đã xóa khỏi hệ thống', 'Nhân viên đã xóa tài khoản của bạn', 'Nhân viên đã xóa tài khoản của bạn')
    //gui thong bao qua mail cho user

    return res.json(1);
})
router.post('/update-client', async (req, res) => {
    if (!req.currentUser || req.currentUser.permisstion != 1) return res.json(null);

    const { userID, displayName, phoneNumber, email, dob, address, password } = req.body;

    if (password) {
        const rs = await User.update({
            displayName,
            email,
            phoneNumber,
            dob,
            address,
            password: bcrypt.hashSync(password, 10),
        }, {
            where: {
                id: userID
            }
        })

        await StaffActivityLog.create({
            staffID: req.currentUser.id,
            message: `Đã cập nhật tài khoản ${userID}`,
        })

        sendMail(email, 'Tài khoản được nhân viên cập nhật', 'Nhân viên đã cập nhật tài khoản của bạn', 'Nhân viên đã cập nhật tài khoản của bạn')
        return res.json(rs);
    }
    if (!password) {
        const rs = await User.update({
            displayName,
            email,
            phoneNumber,
            dob,
            address,
        }, {
            where: {
                id: userID
            }
        })

        await StaffActivityLog.create({
            staffID: req.currentUser.id,
            message: `Đã cập nhật tài khoản ${userID}`,
        })

        sendMail(email, 'Tài khoản được nhân viên cập nhật', 'Nhân viên đã cập nhật tài khoản của bạn', 'Nhân viên đã cập nhật tài khoản của bạn')
        //gui thong bao qua mail cho user

        return res.json(rs);
    }

    return res.json(null);

})

router.post('/search-client', async (req, res) => {
    if (!req.currentUser || req.currentUser.permisstion != 1) return res.json(null);

    const { st } = req.body;
    const found = await User.findClient(st);
    return res.json(found);

})

router.post('/get-info-custom', async (req, res) => {
    const { id } = req.body;
    if (!id) return res.json(null);
    const found = await Customer.getByUserID(id);
    const userFound = await User.findByPk(id);
    let rs = {
        customer: found,
        user: userFound
    }
    return res.json(rs);
})

// request
router.get('/count-client', async (req, res) => {
    // if (!req.currentUser || req.currentUser.permisstion != 1) return res.json(null);
    const page = req.query.page || 1;
    const limit = 6;
    const listUser = await User.countClient()
    if (!listUser) return res.json(0);
    return res.json(listUser);
})
router.get('/get-request', async (req, res) => {
    if (!req.currentUser || req.currentUser.permisstion != 1) return res.json(null);
    const page = req.query.page || 1;
    const limit = 6;
    const listRequest = await UserRequest.findAll({
        order: [['createdAt', 'DESC']],
        limit,
        offset: (page - 1) * limit,
    })
    return res.json(listRequest);
})

router.get('/count-request', async (req, res) => {
    if (!req.currentUser || req.currentUser.permisstion != 1) return res.json(null);
    const rs = await UserRequest.findAndCountAll();
    return res.json((Math.floor(rs.count / 6) + (rs.count % 6 > 0 ? 1 : 0)))
})

router.get('/count-all-request', async (req, res) => {
    if (!req.currentUser || req.currentUser.permisstion != 1) return res.json(null);
    const rs = await UserRequest.findAndCountAll();
    return res.json(rs.count)
})
router.post('/seen-notification', async (req, res) => {
    if (!req.currentUser) return res.json(null);
    const { id } = req.body;
    Notifications.seenNotification(id, req.currentUser.id);
    return res.json(1);
})


router.post('/create-savings', async (req, res) => {
    const { fromSTK, term, balance } = req.body;
    const userID = req.body.userID || req.currentUser.id;
    const currencyUnit = req.body.currencyUnit || 'USD';
    if (!fromSTK || !term || !currencyUnit || !userID || !balance) return res.json(null)
    const rs = await SavingAccount.createRequestSavingAccount(fromSTK, userID, balance, term, currencyUnit)
    return res.json(rs)
})

router.post('/get-list-account', async (req, res) => {
    if (!req.currentUser) return res.json('login first')
    if (req.currentUser.permisstion != 1) {
        const found = await AccountInfo.getAllByUserID(req.currentUser.id);
        return res.json(found);
    }
    const { userId } = req.body;
    const staffFound = await AccountInfo.getAllByUserID(req.currentUser.id);
    return res.json(staffFound);
})


module.exports = router;