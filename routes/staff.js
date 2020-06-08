const express = require('express');
const router = express.Router();
const User = require('../services/user');

// vi du lay danh sach user
router.get('/',async (req,res)=>{

    const users = await User.findBySomeThing();
    return res.render('staff',{users});
})


        
module.exports = router;