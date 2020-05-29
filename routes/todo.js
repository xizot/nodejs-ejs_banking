const express = require('express');
const router = express.Router();
const Todo = require('../services/todo');


router.get('/', (req, res) => {
    if (req.currentUser) {
        res.render('todo');
    }
    else {
        res.redirect('/login');
    }
})

module.exports = router;