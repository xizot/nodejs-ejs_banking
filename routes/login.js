const express = require('express');
const router = express.Router();
const User = require('../services/user');
const asyncHandler = require('express-async-handler');

var errors = null;
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
    return res.json(user);
    if (user) {

        if (await User.verifyPassword(req.body.password, user.password)) {
            errors = null;
            req.session.userID = user.id;
            req.session.email = user.email;
            if (user.token) {
                console.log('Vui lòng kích họat tài khoản');
                return res.redirect('/active');
            }
            else {

                return res.redirect('/todo');
            }
        }
        else {
            errors = "Vui lòng kiểm tra lại mật khẩu";
            return res.redirect('/login');
        }
    }
    else {
        errors = "Vui lòng kiểm tra lại tài khoản";
        return res.redirect('/login');
    }
    // return res.redirect('/login');
}))
module.exports = router;