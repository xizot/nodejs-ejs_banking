const express = require('express');
const router = express.Router();
const User = require('../services/user');

const { sendMail, validateEmail } = require('../services/function');
const { check, validationResult, body } = require('express-validator');
var errors = [];
router.get('/', function (req, res) {
    if (req.currentUser) {
        res.redirect('/');
    }
    else {
        res.render('register', { errors });
    }
})

router.post('/', [
    body('txtPassword').isLength({ min: 6 }).withMessage('Mật khẩu phải lớn hơn 6 kí tự'),
    body('txtDisplayName').trim(),
    body('txtCfPassword').custom((value, { req }) => {
        if (value != req.body.txtPassword) {
            throw new Error('Xác nhận mật khẩu không đúng');
        }
        return true;
    }),
], async function (req, res) {

    errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors = errors.array();
        return res.status(422).render('register', { errors });
    }
    errors = [];
    const user = await User.findBySomeThing(req.body.txtEmail);
    if (user) {
        errors = [{ msg: 'Tài khoản đã tồn tại' }];
        return res.render('register', { errors });
    }
    else {

        var email = null;
        var token = null;
        if (validateEmail(req.body.txtEmail)) {
            email = req.body.txtEmail;
            token = require('crypto').randomBytes(3).toString('hex').toUpperCase();
        }
        const newUser = {
            displayName: req.body.txtDisplayName,
            username: req.body.txtEmail,
            password: require('bcrypt').hashSync(req.body.txtPassword, 10),
            email: email,
            token: token,
        }
        errors = [];
        const reg = await User.createUser(newUser);
        if (reg) {
            req.session.userID = reg.id;
            if (email) {
                sendMail(email, `Mã kích hoạt ${token}`, `Mã kích hoạt ${token}`);
                return res.redirect('/active');
            }
            else {
                return res.redirect('/add-mail');
            }
        }
        else {
            res.redirect('/login');
        }
        return res.redirect('/');

    }
})
module.exports = router;