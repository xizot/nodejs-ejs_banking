const express = require('express');
const router = express.Router();
const accountInfo = require('../services/accountInfo');
var cards = [];
router.get('/', async (req, res) => {

    if (!req.currentUser) return res.redirect('/login')
    if (req.currentUser && !req.currentUser.email && req.currentUser.permisstion == 0) return res.redirect('/add-mail');

    if (req.currentUser && req.currentUser.token && req.currentUser.permisstion == 0) return res.redirect('/active');


    cards = await accountInfo.findAll({
        where: {
            userID: req.currentUser.id,
        }
    })

    // cards = found.map(item => {
    //     item.beginDate = new Date(item.beginDate).toLocaleDateString('en-US');
    // })
    // console.log(found);
    // const card = {
    //     name: 'Nguyen Van Nhat',
    //     beginDate: '6/6',
    //     endDate: '20/22',
    //     bankCode: 'arg',
    //     number: '1244 1234 1544 1922'
    // }
    // cards.push(card)

    return res.render('bankAccount', { cards: cards });
})

module.exports = router;