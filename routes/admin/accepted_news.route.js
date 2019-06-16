var exp = require('express');
var postModel = require('../../models/post.model');
var my_utils = require('../../utils/myUtils');

var router = exp.Router();

router.get('/', (req, res, next) => {
    var page = req.query.page || 1;
    if (page < 1) page = 1;

    var limit = 10;
    var offset = (page - 1) * limit;


    Promise.all([
        postModel.getListByStatus(1,limit, offset),//2: trạng thái chờ xuất bản
        postModel.countByStatus(1),
    ]).then(([rows, count_rows]) => {
        var total = count_rows[0].total;
        var nPages = Math.floor(total / limit);
        if (total % limit > 0) nPages++;
        var pages = [];
        for (i = 1; i <= nPages; i++) {
            var obj = { value: i, active: i === +page };
            pages.push(obj);
        }
        for(i=0;i<rows.length;i++){
            rows[i].date_posted = my_utils.toDateString(rows[i].date_posted)
        }
        res.render('management/admin/vWPosts/accepted_news.hbs', {
            posts: rows,
            pages
        });
    }).catch(next);
})











module.exports = router;