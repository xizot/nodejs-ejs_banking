const express = require('express');
const router = express.Router();
const UserRequest = require('../services/userRequest');
const User = require('../services/user');
const Customer = require('../services/customer');
const { body, validationResult } = require('express-validator');

const path = require('path');
var multer = require('multer')
var upload = multer({ dest: path.join(__dirname, '..', '/public/img') })

var errors = [];



router.get('/', async (req, res) => {
    if (req.currentUser && req.currentUser.isActive == 1) return res.redirect('/')
    const customer = await Customer.getByUserID(req.currentUser.id);

    return res.render('page-confirm', { errors, customer });
})

router.post('/', upload.single('avatar'), async (req, res) => {
    if (!req.currentUser) return res.redirect('/login');
    // xem về multer package để thêm avatar vào folder ./uploads
    const { txtName, txtTypeofCard, txtIdcard, txtIssued, avatar } = req.body;

    console.log(req.file)
    const image = req.file.filename;
    const id = req.currentUser.id;
    if (txtName) {
        const found = await User.findByID(id);
        if (found) {
            found.displayName = txtName;
            found.save();
        }
    }
    const sendRequest = await UserRequest.verifyAccount(id, txtTypeofCard, txtIdcard, txtIssued, image);

    if (sendRequest) {
        return res.redirect('/transfer');
    }
    return res.end("Đã xảy ra lỗi");
})

module.exports = router;