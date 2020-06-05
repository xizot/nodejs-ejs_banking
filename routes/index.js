const express = require('express');
const router = express.Router();

const card = {
    name: 'Nguyen Van Nhat',
    beginDate: '6/6',
    endDate: '20/22',
    bankCode: 'arg',
    number: '1244 1234 1544 1922'
}


router.get('/', (req, res) => {
    return res.render('index', { card });
})

module.exports = router;