const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.currentUser) {
        res.render('index');
    }
    else {
        res.redirect('/login');
    }
})

module.exports = router;