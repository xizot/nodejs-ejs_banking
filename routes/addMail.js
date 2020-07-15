const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../services/user');
const { sendMail } = require('../services/function');
var errors = [];
router.get('/', (req, res) => {
    return res.render('addMail', { errors });
})
router.post('/', [
    body('txtEmail').isEmail().withMessage("Invalid email format"),
    body('txtEmail').custom(async value => {
        const found = await User.findByEmail(value);
        if (found)
            throw new Error('Email already exists')
        return true;
    })

], async (req, res) => {
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors = errors.array();
        return res.status(422).render('addMail', { errors });
    }
    errors = [];
    const email = req.body.txtEmail;



    const found = await User.findByPk(req.currentUser.id);
    if (found) {
        const token = require('crypto').randomBytes(3).toString('hex').toUpperCase();
        found.token = token;
        found.email = email;
        found.save();
        sendMail(email, `Mã kích hoạt ${token}`, `Mã kích hoạt ${token}`);
        return res.redirect('/active');
    }
    return res.redirect('/login');
})
module.exports = router;