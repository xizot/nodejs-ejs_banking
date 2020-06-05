const express = require('express');
const router = express.Router();
const { sendSMS } = require('../services/function');
const { check, validationResult, body } = require('express-validator');
const crypto = require('crypto');
const User = require('../services/user');


var errors = [];
router.get('/', (req, res) => {
    return res.render('activePhoneNumber', { errors });
})

router.post('/', [
    body('txtPhoneCode').isLength({ min: 6, max: 6 }).withMessage('Phone code must be 6 characters'),
], async (req, res) => {

    errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors = errors.array();
        return res.status(422).redirect('/active-phone-number');
    }
    errors = [];
    const id = req.currentUser.id;
    const code = req.body.txtPhoneCode;
    if (await User.activePhoneNumber(id, code)) {
        return res.redirect('/');
    }
    else {
        errors = [{ msg: 'The code is not valid' }];
    }
    return res.redirect('/active-phone-number');


})


module.exports = router;