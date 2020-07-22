const express = require('express');
const router = express.Router();
const Transfer = require('../../services/transfer');
const UserRequest = require('../../services/userRequest');
const StaffActivity = require('../../services/staffActivityLog');
// lấy tất cả thông báo
router.get('/all-notification', async (req, res) => {
    const notis = await UserRequest.findAll({
        order: [['createdAt', 'DESC']]
    })

    return res.json(notis);
})
// lấy thông tin giao dịch của 1 user, có phân trang
router.get('/:id', async (req, res) => {

    const id = req.params.id;
    const { page, limit } = req.query;
    if (!page || !limit) return res.json(null);

    const found = await Transfer.getActivityLimit(id, page, limit);

    return res.json(found);
})

router.get('/add-activity', async (req, res) => {
    if (!req.currentUser && req.currentUser.permisstion != 1) return null;
    const { msg } = req.body;
    const newActivity = await StaffActivity.create({
        staffID: req.currentUser.id,
        message: msg,
    })
    return res.json(newActivity);
})




module.exports = router;