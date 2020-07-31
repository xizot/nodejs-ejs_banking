const { route } = require('.');

const router = require('express').Router();


router.get('/', (req, res) => {
    if (!req.currentUser) return res.redirect('/login');

    return res.render('change-limit')
})

module.exports = router;