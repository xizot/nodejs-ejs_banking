const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../services/user');
var errors = [];


router.get('/', (req, res) => {
    return res.render('forgotPassword', { errors })
})
router.post('/', async (req, res) => {
    const txtCode = req.body.txtCode || null;
    const txtEmail = req.body.txtEmail || null;
    let found = null;
    if (req.session.fgEmail) {
        found = await User.findByEmail(req.session.fgEmail);
    }
    if (txtEmail) {
        delete req.session.fgEmail;

        req.session.fgEmail = txtEmail;
        found = await User.findByEmail(txtEmail);
        if (found) {
            errors = [];
            found.forgotPassword();
            return res.render('confirmForgotPassword', { errors })
        }
        errors = [{ msg: 'Không tìm thấy tài khoản phù hợp với mail bạn vừa nhập' }]
        return res.redirect('/forgot-password');
    }
    if (txtCode) {
        if (found) {
            errors = [];
            if (await found.confirmForgotCode(txtCode)) {
                return res.end('thanh cong');
            }
            errors = [{ msg: 'Code không hợp lệ' }];
            return res.render('confirmForgotPassword', { errors })

        }
        errors = [{ msg: 'Đã xảy ra lỗi' }]

        return res.end(txtCode);
    }
})
module.exports = router;