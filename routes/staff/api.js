const express = require('express');
const router = express.Router();
const Transfer = require('../../services/transfer');


// lấy thông tin giao dịch của 1 user, có phân trang
router.get('/:id', async (req,res)=>{

    const id = req.params.id;
    const {page, limit} = req.query;

    const found = await Transfer.getActivityLimit(id,page,limit);
    
    return res.json(found);
})

router.get('/', async (req,res)=>{

    


})
module.exports = router;