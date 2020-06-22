const express = require('express');
const router = express.Router();
const requestActiveUser = require('../services/requestActiveUser');
const { body, validationResult } = require('express-validator');
var errors = [];


router.get('/', (req, res) => {
    return res.render('page-confirm', { errors });
})

router.post('/', async (req, res) => {

    // const id = req.session.id;
    const name = req.body.txtName;
    const typeOfcard = req.body.txtTypeofCard;
    const Idcard = req.body.txtIdcard;
    const issued = req.body.txtIssued;
    const avatar= req.body.avatar;

    const found = await requestActiveUser.sendRequest(name,typeOfcard, Idcard, issued, avatar );
    if(found)
    {
        
    }
})

module.exports = router;