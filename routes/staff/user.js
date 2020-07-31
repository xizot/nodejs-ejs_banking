const router = require('express').Router();

router.get('/', (req, res) => {

    if (!req.currentUser) return res.redirect('/login');
    if (req.currentUser.permisstion != 1) return res.redirect('/error');

    const { id, edit } = req.query;
    if (!id) return res.render('./staff-views/user');
    if (!edit) return res.render('./staff-views/user-info');
    return res.render('./staff-views/user-info-edit');
})

module.exports = router;