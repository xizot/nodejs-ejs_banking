const express = require('express');
const router = express.Router();
const requestActiveUser = require('../services/requestActiveUser');
const User = require('../services/user');
const Customer = require('../services/customer');
const { body, validationResult } = require('express-validator');

const path = require('path');
var multer = require('multer')
var upload = multer({ dest: path.join(__dirname, '..', 'uploads') })

var errors = [];



router.get('/', async (req, res) => {
    const customer = await Customer.getByUserID(req.currentUser.id);

    return res.render('page-confirm', { errors, customer });
})

router.post('/', upload.single('avatar'), async (req, res) => {
    // const customer = await Customer.getByUserID(req.currentUser.id);

    // xem về multer package để thêm avatar vào folder ./uploads
    const id = req.currentUser.id;
    const name = req.body.txtName;
    const typeOfcard = req.body.txtTypeofCard;
    const Idcard = req.body.txtIdcard;
    const issued = req.body.txtIssued;
    const avatar = req.file.filename;

    if (name) {
        const found = await User.findByID(req.currentUser.id);
        if (found) {
            found.displayName = name;
            found.save();
        }
    }
    const sendRequest = await requestActiveUser.sendRequest(id, typeOfcard, Idcard, issued, avatar);

    if (sendRequest) {
        return res.redirect('/transfer');
    }
    return res.end("Đã xảy ra lỗi");
})

module.exports = router;