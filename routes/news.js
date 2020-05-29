const express = require('express');
const router = express.Router();
const News = require('../services/news');

router.get('/', async (req, res) => {
    var page = 0;
    const news = await News.getPage(page, 8);
    return res.json(news);
})

router.get('/all', async (req, res) => {

    const news = await News.getAll();
    return res.json(news);
})

router.get('/:id', async (req, res) => {
    var page = req.params.id || 0;
    const news = await News.getPage(page, 8);
    return res.json(news);
})

module.exports = router;