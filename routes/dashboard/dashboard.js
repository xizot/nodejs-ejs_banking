// file này chứa các chức nawg của page dashboard

const express = require('express');
const router = require.Router();

router.get('/', async (req,res)=>{
    if(!req.currentUser) return res.status(409).redirect('/login');

    return res.status(200).render('dashboard');
})
module.exports = router;