var express = require('express');

var router = express.Router();

router.get('/:id', (req, res) => {
    res.end('posts');
});

module.exports = router;