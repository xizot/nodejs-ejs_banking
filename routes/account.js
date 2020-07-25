const router = require('express').Router();


router.get('/', (req, res) => {
    return res.render('client-account')
})

module.exports = router;