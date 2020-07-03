const express = require('express');
const router = express.Router();
const User = require('../../services/user');
const bcrypt = require('bcrypt');


let errors = [];

router.get('/', (req, res) => {
    if (!req.currentUser) return res.redirect('/alert/login-first');

    return res.status(200).render('userActions/changePassword', { errors })
})

router.post('/', async (req, res) => {
    errors = [];
    if (!req.currentUser) return res.redirect('/login-first');
    const { oldPassword, newPassword, confirmPassword } = req.body;


    if (newPassword !== confirmPassword) {
        errors = [{
            msg: 'Mật khẩu xác thực không trùng khớp'
        }]
        return res.json(errors);
    }

    const found = await User.findByEmail(req.currentUser.email);

    if (found) {
        if (await User.verifyPassword(oldPassword, found.password)) {
            found.password = bcrypt.hashSync(newPassword, 10);
            found.save();
            return res.end('1')
        }

        errors = [{
            msg: 'Mật khẩu cũ không đúng'
        }]
        return res.json(errors);
    }
    return res.json('-1');;
})

module.exports = router;