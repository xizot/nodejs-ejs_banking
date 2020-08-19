const router = require('express').Router();

router.get('/', (req, res) => {
    if (!req.currentUser) return res.redirect('/login')
    if (req.currentUser && req.currentUser.isActive == 5) return res.redirect('/alert/blocked')
    if (req.currentUser && !req.currentUser.email && req.currentUser.permisstion == 0) return res.redirect('/add-mail');

    if (req.currentUser && req.currentUser.token && req.currentUser.permisstion == 0) return res.redirect('/active');

    if (req.currentUser.isActive != 1) {
        return res.redirect('/page-confirm');
    }
    return res.render('withdraw')
})

module.exports = router;