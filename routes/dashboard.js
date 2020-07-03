const express = require('express');
const router = express.Router();

const Transfer = require('../services/transfer');
const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JULY", "AUG", "SEP", "OCT", "NOV", "DEC"];

router.get('/', async (req, res) => {

    if (!req.currentUser) {
        return res.redirect('/login');
    }
    const Activity = await Transfer.getActivity(req.currentUser.id);
    return res.render('dashboard', { Activity, months });
})



module.exports = router;