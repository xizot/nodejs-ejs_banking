const express = require('express');
const router = express.Router();

const AccountInfo = require('../services/accountInfo');
var info = "";


router.get('/', async (req, res) => {

    if (!req.currentUser) return res.redirect('/login')
    if (req.currentUser && !req.currentUser.email && req.currentUser.permisstion == 0) return res.redirect('/add-mail');

    if (req.currentUser && req.currentUser.token && req.currentUser.permisstion == 0) return res.redirect('/active');

    info = await AccountInfo.getByUserID(req.currentUser.id);
    return res.render('info', { info });
})

router.post('/', async (req, res) => {

    console.log(req.body);
})


module.exports = router;