var exp = require('express');
var categoryModel = require('../../models/category.model');

var router = exp.Router();

router.get('/', function (req, res, next) {
    res.render('management/admin/admin.hbs');
});

router.get('/tags', function (req, res, next) {
    res.render('management/admin/vWTags/tags.hbs');
});


module.exports = router;