const router = require('express').Router();

router.get('/', (req, res) => {
    return res.render('withdraw')
})

module.exports = router;