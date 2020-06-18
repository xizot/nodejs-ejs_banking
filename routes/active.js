const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../services/user');
var errors = [];
router.get('/', (req, res) => {
    return res.render('active', { errors });
})

router.post('/', [
    body('token').notEmpty().withMessage('Token is not empty')
    ,
    body('token').isLength({ min: 6, max: 6 }).withMessage('Max length is 6 characters')
], async (req, res) => {
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors = errors.array();
        return res.status(422).render('active', { errors });
    }
    errors = [];

    const token = req.body.token;

    const id = req.currentUser.id;
    const found = await User.findByPk(id);

    if (found) {
        if (found.token === token) {
            found.token = null;
            found.save();
            return res.redirect('/');
        }
        return res.render('active', { errors: [{ msg: 'Token is invalid' }] });
    }

    return res.redirect('/login');


})

module.exports = router;