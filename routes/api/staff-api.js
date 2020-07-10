const express = require('express');
const router = express.Router();

const {StaffBlockUser,StaffDeleteUser,StaffRechargeToUser }= require('../../services/function');




router.post('/recharge', async (req,res)=>{
    const {userID,STK,amount,currencyInit } = req.body;
    const staffID = req.currentUser.id;

    if(!staffID || !userID || !amount || !currencyInit){
        return null;
    }
    return StaffRechargeToUser(staffID,userID,STK,amount);
})
router.post('/delete', async (req,res)=>{
    const {userID} = req.body;
    const staffID =req.body.staffID || req.currentUser.id;

    if(!staffID || !userID || !amount || !currencyInit){
        return null;
    }
    return StaffDeleteUser(staffID,userID);
})

router.post('/block', async (req,res)=>{
    const {userID} = req.body;
    const staffID =req.body.staffID || req.currentUser.id;

    if(!staffID || !userID){
        return null;
    }
    return StaffBlockUser(staffID,userID);
})






module.exports = router;

