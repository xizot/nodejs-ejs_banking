const router = require('express').Router();
router.get('/', async (req, res) => {
    return res.render('client-history');
})


module.exports = router;