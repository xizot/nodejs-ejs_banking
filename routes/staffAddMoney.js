const router = require('express').Router();

router.get('/', async (req, res) => {
    return res.render('./staff-views/staff-add-money')
})


module.exports = router;