const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    delete req.session.userID;
    res.redirect('/');
})

module.exports = router;