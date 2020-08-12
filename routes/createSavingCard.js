const router = require('express').Router();

router.get('/', async (req, res) => {

    if (!req.currentUser) return res.redirect('/login')
    if (req.currentUser && !req.currentUser.email && req.currentUser.permisstion == 0) return res.redirect('/add-mail');

    if (req.currentUser && req.currentUser.token && req.currentUser.permisstion == 0) return res.redirect('/active');


    const id = req.currentUser.id || null;
    if (!req.currentUser) return null;

    return res.render('saving')
})



module.exports = router;