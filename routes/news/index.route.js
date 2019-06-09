var express = require('express');

var post_model = require('../../models/post.model');
var cat_model = require('../../models/category.model');

var my_utils = require('../../utils/myUtils');

var router = express.Router();

// trang chu
router.get('/', (req, res) => {

    // lấy dữ liệu

    var now = new Date();

    var last_week = new Date();

    last_week.setDate(now.getDate() - 7);

    var time = {
        start: my_utils.toSQLDateTimeString(last_week),
        end: my_utils.toSQLDateTimeString(now)
    };

    Promise
        .all([
            post_model.mostViewInTime_Thumbnail(4, time),
            post_model.mostView_Thumbnail(10),
            post_model.newest_Thumbnail(10)
        ])
        .then(values => {
            // lấy được array 3 ôbject
            // lấy tiếp 10 cat trong mỗi cat có 1 post mới nhất

            cat_model.exceptRootCatExistPost()
                .then(categories => {
                    var categories_clone_10 = categories.slice(0, categories.length > 10 ? 10 : categories.length);
                    Promise
                        .all(
                            categories_clone_10.map((val, idx) => {
                                return post_model.newestByCat_Thumbnail(1, val.id);
                            })
                        )
                        .then(post_by_cats => {

                            var top10_posts = [];

                            for (let i = 0; i < categories_clone_10.length; i++) {
                                var cat_with_post = {
                                    cat: categories_clone_10[i],
                                    post: null
                                }

                                if (post_by_cats[i] !== []){
                                    cat_with_post.post = post_by_cats[i][0];
                                }

                                // console.log(cat_with_post);

                                top10_posts.push(cat_with_post);
                            }
                            res.render('news/index', {
                                mostViewInWeek4 : values[0],
                                mostView10 : values[1],
                                newest10 : values[2],
                                catsWithPost : top10_posts
                            });
                        })
                        .catch(err => {

                        })
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {

        })
})

// trang hien thi cac bai viet trong danh muc
router.get('/categories/:id/posts', (req, res) => {
    res.end('category');
})

// trang chi tiet bai viet
router.get('/posts/:id', (req, res) => {
    res.end('post');
})

module.exports = router;