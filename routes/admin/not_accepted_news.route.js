var exp = require('express');
var postModel = require('../../models/post.model');

var router = exp.Router();

router.get('/', (req, res, next) => {
    var page = req.query.page || 1;
    if (page < 1) page = 1;

    var limit = 10;
    var offset = (page - 1) * limit;


    Promise.all([
        postModel.getListByStatus(4,limit, offset),//4: trạng thái chưa duyệt
        postModel.countByStatus(4),
    ]).then(([rows, count_rows]) => {
        var total = count_rows[0].total;
        var nPages = Math.floor(total / limit);
        if (total % limit > 0) nPages++;
        var pages = [];
        for (i = 1; i <= nPages; i++) {
            var obj = { value: i, active: i === +page };
            pages.push(obj);
        }

        res.render('management/admin/vWPosts/not_accepted_news.hbs', {
            posts: rows,
            pages
        });
    }).catch(next);
})











module.exports = router;