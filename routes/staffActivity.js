const router = require('express').Router();

router.get('/', async (req, res) => {
    return res.render('staff-activity')
})


module.exports = router;