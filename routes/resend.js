const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { sendMail } = require('../services/function');
const User = require('../services/user');
const crawler = require('./crawler');

router.get('/', async (req, res) => {
    if (req.session.userID) {
        const token = crypto.randomBytes(3).toString('hex').toUpperCase();
        const found = await User.findByID(req.session.userID);
        const email = req.session.email;
        if (found) {
            found.token = token;
            found.save();
            const link = `<h3 style="padding:40px 0px;">Kích hoạt tài khoản:</h3> <a style="padding:10px 20px; background:#ddd;border-radius:8px; text-decoration:none;color:#333; font-weight:bolder" href="${process.env.BASE_URL}/active?token=${token}&&userID=${req.session.userID}">${token}</a>`;
            setTimeout(() => { sendMail(email, "Kích hoạt tài khoản", `Mã kích hoạt: ${token}`, link); }, 0);
            return res.redirect('/active');
        }
    }

    return res.redirect('/login');
})
module.exports = router;