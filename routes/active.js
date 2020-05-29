const express = require('express');
const router = express.Router();
const User = require('../services/user');
const News = require('../services/news')
const { sendNews } = require('../services/function');
var errors = null;


router.get('/', async (req, res) => {
    var token = null;
    if (req.query) {
        token = req.query.token;
        const userID = req.query.userID;
        if (token && userID) {

            const found = await User.findByID(userID);

            if (!found || !found.token && !req.userID) {
                return res.redirect('/login');
            }

            if (await User.active(token, userID)) {
                errors = null;
                req.session.userID = userID;

                const allNews = await News.getAll();
                sendNews(userID, allNews);
                return res.redirect('/');
            }
            else {
                errors = 'Mã kích hoạt không hợp lệ';
            }
        }
    }
    res.render('active', { errors, token })
})

router.post('/', async (req, res) => {
    const token = req.body.token;
    const userID = req.session.userID;
    if (await User.active(token, req.session.userID)) {
        errors = null;
        const allNews = await News.getAll();
        sendNews(userID, allNews);
        return res.redirect('/');
    }
    errors = 'Mã kích hoạt không hợp lệ';
    return res.redirect('/active', { errors })
})
module.exports = router;