const express = require('express');
const router = express.Router();
const requestActiveUser = require('../services/requestActiveUser');
const User = require('../services/user');
const { body, validationResult } = require('express-validator');
var multer  = require('multer')
var upload = multer({ dest: '../uploads/' })

var errors = [];


router.get('/', (req, res) => {
    return res.render('page-confirm', { errors });
})

router.post('/', upload.single('avatar'), async (req, res) => {


    // xem về multer package để thêm avatar vào folder ./uploads
    const id = req.currentUser.id;
    const name = req.body.txtTypeofCard;
    const typeOfcard = req.body.txtTypeofCard;
    const Idcard = req.body.txtIdcard;
    const issued = req.body.txtIssued;
    const avatar= req.file;

    // const found = await requestActiveUser.sendRequest(id,typeOfcard, Idcard, issued, avatar );
    // const found1 = await User.findOne({
    //     where:{
    //         id:id
    //     }
    // })

    // if(found1){
    //     found1.displayName = name;
    //     found1.save();
    // }
    // if(found)
    // {
        
    // }
})

module.exports = router;