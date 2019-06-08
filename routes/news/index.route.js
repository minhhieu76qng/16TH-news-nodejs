var express = require('express');

var post_model = require('../../models/post.model');
var cat_model = require('../../models/category.model');

var my_utils = require('../../utils/myUtils');

var router = express.Router();

// trang chu
router.get('/', (req, res) => {
    res.render('news/index');
})

// trang hien thi cac bai viet trong danh muc
router.get('/categories/:id/posts', (req, res) => {
    res.end('category');
})

// trang chi tiet bai viet
router.get('/post/:id', (req, res) => {
    res.end('post');
})

module.exports = router;