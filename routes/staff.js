const express = require('express');
const router = express.Router();
const User = require('../services/user');

<<<<<<< HEAD
var users =null;
// vi du lay danh sach user
router.get('/',async (req,res)=>{
        return  res.render('staff',{users})
   
})

router.post('/',async (req, res)=>{

    console.log(req.body.txtCustomer)
    if(req.body.txtCustomer){
        users = await User.findBySomeThing( req.body.txtCustomer);
        // cai nay de tra 1 nguoi. sao xai forEach duoc ?
        console.log(users);
        return  res.render('staff',{users})
    }
    return res.end('done');
})

        
=======
// vi du lay danh sach user
router.get('/',async (req,res)=>{

    const users = await User.findAll();
    return res.render('staff',{users});
})
>>>>>>> be870e701838c41b2e48b3a5e059faaa3963c80c
module.exports = router;