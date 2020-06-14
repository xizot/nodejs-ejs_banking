const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op= Sequelize.Op;
const Transfer = require('../services/transfer');
const AccountInfo = require('../services/accountInfo');
const User = require('../services/user');

router.get('/:id', async (req,res)=>{

    // có id rồi đấy. đừng tí rồi bật lại :3

    const {id} = req.params;
    // thông tin chueyẻn khảon
    const htrTransfer = await Transfer.findAll(
        { 
            where:{
                [Op.or]:{
                    from:{
                        [Op.eq]:id
                    },
                    to:{
                        [Op.eq]:id
                    }
                    
                }
               
        }
    }); // lấy lịch sử giao dịch. 1 người có thể giao dịch nhiều lần nên phải tìm tất cả

   // thong tin tai khoan
    const accountInfo = await AccountInfo.getByUserID(id);
    if(!accountInfo){
        return res.end('khong ton tai hoac chua cap nhat tai khoan ngan hang');
    }
    //thông tin cá nhân

    const userInfo = await User.findByID(id);



    if(htrTransfer ){
        return res.render('showTransferHistory',{accountInfo, htrTransfer, id:userInfo.id, displayName:userInfo.displayName});
    }
    
    return res.end('loi gi ko biet');

})

module.exports = router;

const rsUser =null;