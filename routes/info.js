const express = require('express');
const router = express.Router();

const AccountInfo = require('../services/accountInfo');
var info = "";


router.get('/', async (req, res) => {
    info = await AccountInfo.getByUserID(req.currentUser.id);
    console.log(info);
    return res.render('info', { info });
})

router.post('/', async (req, res) => {

    console.log(req.body);
})


module.exports = router;