const express = require('express');
const router = express.Router();

router.get('/changePasswordSuccess', (req,res)=>{
    return res.status(200).render('alert/alert', {msg: 'Đổi mật khẩu thành công". <a href="/">Ấn vào đây để quay lại trang chủ</a>', title:'Reset Password Successfully'})
})
router.get('/resetPasswordSuccess', (req,res)=>{
    return res.status(200).render('alert/alert', {msg: 'Reset mật khẩu thành công. Mật khẩu được đặt lại là "123456". <a href="/">Ấn vào đây để quay lại trang chủ</a>', title:'Reset Password Successfully'})
})
router.get('/login-first', (req,res)=>{
    return res.status(409).render('alert/alert', {msg: 'Vui lòng đăng nhập. <a href="/login">Ấn vào đây</a>', title:'Reset Password Successfully'})
})
router.get('/404', (req,res)=>{
    return res.status(404).render('alert/alert', {msg: 'Đã xảy ra lỗi. <a href="/">Ấn vào đây để quay lại</a>', title:'Reset Password Successfully'})
})


module.exports = router;