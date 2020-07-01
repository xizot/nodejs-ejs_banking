const express = require('express');
const router = express.Router();
const User = require('../../services/user');
const bcrypt = require('bcrypt');


let errors = [];

router.get('/', (req,res)=>{
    if(!req.currentUser) return res.redirect('/alert/login-first');

    return res.status(200).render('userActions/changePassword',{errors})
})

router.post('/', async(req,res)=>{
    errors = [];
    if(!req.currentUser) return res.redirect('/login-first');
    const {oldPassword, newPassword, confirmPassword} = req.body;
    if(!oldPassword || !newPassword || !confirmPassword){
        errors = [ {
            msg:'Vui lòng điền đẩy đủ thông tin'
        }]
        return res.status(409).redirect('/change-password');
    }

    if(newPassword !== confirmPassword){
        errors = [ {
            msg:'Mật khẩu xác thực không trùng khớp'
        }]
        return res.status(409).redirect('/change-password');
    }

    const found = await User.findByEmail(req.currentUser.email);

    if(found){
        if(await User.verifyPassword(oldPassword, found.password)){
            found.password = bcrypt.hashSync(newPassword,10);
             found.save();
             return res.redirect('/alert/changePasswordSuccess')
        }

        errors = [ {
            msg:'Mật khẩu cũ không đúng'
        }]
        return res.status(409).redirect('/change-password');

    }
    return res.status(404).redirect('/alert/404');


})

module.exports = router;