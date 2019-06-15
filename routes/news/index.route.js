var express = require('express');
var moment = require('moment');

var post_model = require('../../models/post.model');
var cat_model = require('../../models/category.model');
var tag_model = require('../../models/tag.model');

var my_utils = require('../../utils/myUtils');

var router = express.Router();

// trang chu
router.get('/', (req, res, next) => {
    var now = new Date();

    res.locals.isHomepage = true;

    res.locals.pageTitle = 'Trang chủ';

    let beginOfWeek = moment(my_utils.getBeginOfWeek()).format('YYYY/MM/DD');

    Promise
        .all([
            post_model.impressedPost(beginOfWeek, 4),
            post_model.mostView_Thumbnail(10),
            post_model.newest_Thumbnail(10),
            tag_model.getHotestTags(10)
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
                                return post_model.newestByCat_Thumbnail(val.id, 1);
                            })
                        )
                        .then(post_by_cats => {
                            var top10_posts = [];

                            for (let i = 0; i < categories_clone_10.length; i++) {
                                var cat_with_post = {
                                    cat: categories_clone_10[i],
                                    post: null
                                }

                                if (post_by_cats[i] !== []) {
                                    cat_with_post.post = post_by_cats[i][0];
                                }

                                top10_posts.push(cat_with_post);
                            }
                            res.render('news/index', {
                                mostViewInWeek4: values[0].map((v, idx) => {
                                    v.date_posted = my_utils.toDateString(v.date_posted);
                                    return v;
                                }),
                                mostView10: values[1].map((v, idx) => {
                                    v.date_posted = my_utils.toDateString(v.date_posted);
                                    return v;
                                }),
                                newest10: values[2].map((v, idx) => {
                                    v.date_posted = my_utils.toDateString(v.date_posted);
                                    return v;
                                }),
                                catsWithPost: top10_posts.map((v, idx) => {
                                    v.post.date_posted = my_utils.toDateString(v.post.date_posted);
                                    return v;
                                }),
                                tags: values[3]
                            });
                        })
                        .catch(next);
                })
        })
        .catch(next);
})

module.exports = router;