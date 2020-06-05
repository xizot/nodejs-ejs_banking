const express = require('express');
const router = express.Router();
const { sendSMS } = require('../services/function');
const { check, validationResult, body } = require('express-validator');
const crypto = require('crypto');
const User = require('../services/user');


var errors = [];
router.get('/', (req, res) => {
    return res.render('updatePhoneNumber', { errors });
})

router.post('/', [
    body('txtPhoneNumber')
        .isLength({ min: 10, max: 11 }).withMessage('Phone number must be 10 -> 11 characters')
        .custom((value) => {

            var reg = /^\d+$/;
            if (!reg.test(value)) {
                throw new Error('Phone number not contain string');
            }

            return true;
        })
], (req, res) => {

    errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors = errors.array();
        return res.status(422).redirect('/update-phone-number');
    }
    const number = '84' + req.body.txtPhoneNumber.slice(1);

    const phoneCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    sendSMS(number, phoneCode);
    User.setPhoneNumberCode(req.currentUser.id, number, phoneCode)
    return res.redirect('/active-phone-number');
})

module.exports = router;