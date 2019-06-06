var express = require('express');

var router = express.Router();

router.get('/', (req, res) => {
    res.render('news/index');
})

router.get('/category/:id', (req, res) => {
    res.end('category');
})

router.get('/post/:id', (req, res) => {
    res.end('post');
})

module.exports = router;