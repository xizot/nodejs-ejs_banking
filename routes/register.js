const express = require('express');
const router = express.Router();
const User = require('../services/user');
const asyncHandler = require('express-async-handler');
const { check, validationResult, body } = require('express-validator');
const { sendMail } = require('../services/function');
const crypto = require('crypto');

var errors = [];

router.get('/', (req, res) => {
    console.log(errors);
    res.render('register', { errors });
})
router.post('/', [
    body('displayName')
        .trim()
    ,
    body('email')
        .isEmail()
        .withMessage('Must be a email')
        .custom(async value => {
            const found = await User.findUserByEmail(value);
            if (found) {
                throw new Error('Email already exists');
            }
            return true;
        }),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 chars long'),
    body('cfpassword')
        .custom((value, { req }) => {
            if (value != req.body.password) {
                throw new Error('Password confirmation is incorrect');
            }
            return true;
        })
], asyncHandler(async (req, res) => {

    errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors = errors.array();
        return res.status(422).redirect('/register');
    }
    else {
        const email = req.body.email;
        const password = req.body.password;
        const displayName = req.body.displayName;
        const token = crypto.randomBytes(3).toString('hex').toUpperCase();

        const newUser = await User.addUser(email, password, displayName, token);
        if (newUser) {
            errors = [];
            req.session.userID = newUser.id;

            const link = `<h3 style="padding:40px 0px" >Kích hoạt tài khoản:</h3> <a style="padding:10px 20px; background:#ddd;border-radius:8px; text-decoration:none;color:#333; font-weight:bolder" href="${process.env.BASE_URL}/active?token=${token}&&userID=${req.session.userID}">${token}</a>`;

            // setTimeout(() => { 
            sendMail(email, "Kích hoạt tài khoản", `Mã kích hoạt: ${token}`, link);
            //  }, 0)
            return res.redirect('/active');
        }
        else {
            errors = ['Đã xảy ra lỗi'];
            return res.redirect('/register');
        }
    }

}))


module.exports = router;