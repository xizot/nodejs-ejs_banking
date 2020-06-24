const express = require('express');
const router = express.Router();
const User = require('../services/user');
var currentFind = null;

var users =null;
// vi du lay danh sach user
router.get('/',async (req,res)=>{
    console.log(req.currentUser.permisstion)
    
    if(req.currentUser.permisstion != 1){
               res.redirect('/error');
    }
        return  res.render('staff',{users,currentFind})
   
})

router.post('/',async (req, res)=>{
    currentFind =req.body.txtCustomer || null;
    if(req.body.txtCustomer){
        users = await User.findBySomeThing( req.body.txtCustomer);
        console.log(users);
        return  res.render('staff',{users, currentFind})
    }
    return res.end('done');
})

        
// vi du lay danh sach user
router.get('/',async (req,res)=>{

    const users = await User.findAll();
    return res.render('staff',{users});
})
module.exports = router;