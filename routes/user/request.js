const express = require('express');
const { sendRequest } = require('../../services/userRequest');
const router = express.Router();


router.get('/send-request-create-credit-card', async (req, res) => {
    if (!req.currentUser) return null;
    const rs = await sendRequest(req.currentUser.id, 2);
    return res.json(rs);
})
router.get('/send-request-create-saving-card', async (req, res) => {
    if (!req.currentUser) return null;
    const rs = await sendRequest(req.currentUser.id, 3);
    return res.json(rs);
})
router.get('/send-request-block-account-', async (req, res) => {
    if (!req.currentUser) return null;
    const rs = await sendRequest(req.currentUser.id, 4);
    return res.json(rs);
})


module.exports = router;