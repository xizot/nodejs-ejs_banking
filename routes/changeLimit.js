const { route } = require('.');

const router = require('express').Router();


router.get('/', (req, res) => {
    if (!req.currentUser) return res.redirect('/login')

    if (!req.currentUser.email && req.currentUser.permisstion == 0) return res.redirect('/add-mail');

    if (req.currentUser.token && req.currentUser.permisstion == 0) return res.redirect('/active');
    if (req.currentUser.isActive == 5) return res.redirect('/alert/blocked')
    return res.render('change-limit')
})

module.exports = router;