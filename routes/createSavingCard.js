const router = require('express').Router();

router.get('/', async (req, res) => {

    if (!req.currentUser) return res.redirect('/login')

    if (req.currentUser.email && req.currentUser.permisstion == 0) return res.redirect('/add-mail');

    if (req.currentUser.token && req.currentUser.permisstion == 0) return res.redirect('/active');
    if (req.currentUser.isActive == 5) return res.redirect('/alert/blocked')


    const id = req.currentUser.id || null;
    if (!id) return res.end('error');

    return res.render('saving')
})



module.exports = router;