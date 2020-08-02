const express = require('express');
const router = express.Router();
const User = require('../services/user');
const asyncHandler = require('express-async-handler');
const { check, validationResult, body } = require('express-validator');



var errors = [];
router.get('/', function (req, res) {
    if (req.currentUser) {
        res.redirect('/');
    }
    else {
        res.render('login', { errors });
    }
})

router.post('/', asyncHandler(async function (req, res) {


    const user = await User.findBySomeThing(req.body.txtEmail);
    if (user) {

        if (await User.verifyPassword(req.body.txtPassword, user.password)) {
            errors = [];
            req.session.userID = user.id;
            req.session.email = user.email;

            if (!user.email) return res.redirect('/add-mail')
            if (user.forgotCode) {
                req.session.fgEmail = user.email;

                return res.redirect('/forgot-password');
            }
            if (user.token) return res.redirect('/active');
            if (user.isActive == 5) return res.redirect('/alert/blocked')
            return res.redirect('/');
        }
        else {
            errors = [{ msg: "Vui lòng kiểm tra lại mật khẩu" }];
            return res.redirect('/login');
        }
    }
    else {
        errors = [{ msg: "Vui lòng kiểm tra lại tài khoản" }];
        return res.redirect('/login');
    }
}))
module.exports = router;