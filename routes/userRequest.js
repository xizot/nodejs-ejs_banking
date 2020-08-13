const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {

    if (!req.currentUser) return res.redirect('/login')
    if (req.currentUser && req.currentUser.isActive == 5) return res.redirect('/alert/blocked')
    if (req.currentUser && req.currentUser.permisstion != 1) return res.redirect('/error')
    return res.render('userRequest');
})
module.exports = router;