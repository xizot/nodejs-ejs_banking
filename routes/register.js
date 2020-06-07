const express = require('express');
const router = express.Router();
const User = require('../services/user');

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
    body('txtDisplayName').trim(),
    body('txtCfPassword').custom((value, { req }) => {
        if (value != req.body.txtPassword) {
            throw new Error('Xác nhận mật khẩu không đúng');
        }
        return true;
    })
], async function (req, res) {
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors = errors.array();
        return res.status(422).render('register', { errors });
    }
    const user = await User.findBySomeThing(req.body.txtEmail);
    if (user) {
        errors = [{ msg: 'Tài khoản đã tồn tại' }];
        return res.render('register', { errors });
    }
    else {
        const newUser = {
            displayName: req.body.txtDisplayName,
            email: req.body.txtEmail,
            password: req.body.txtPassword,
        }

        const reg = await User.createUser(newUser);
        req.session.userID = reg.id;
        return res.redirect('/');
    }
})
module.exports = router;