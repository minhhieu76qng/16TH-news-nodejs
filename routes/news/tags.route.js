var express = require('express');
var category_model = require('../../models/category.model');
var post_model = require('../../models/post.model');
var tag_model = require('../../models/tag.model');

var my_utils = require('../../utils/myUtils');

var router = express.Router();

router.get('/:id/posts', (req, res, next) => {

    let limit = 7, offset = 0;

    let page = req.query.page || 1;

    if (page < 1) {
        page = 1;
    }

    offset = limit * (page - 1);

    // kiểm tra tag_id này có tồn tại hay không
    let tag_id = +req.params.id;

    if (isNaN(tag_id)) {
        throw new Error('Tag ID is not valid.');
    } else {
        tag_model
            .getTagsById(tag_id)
            .then(tag => {

                if (tag.length === 0) {
                    next();
                } else {
                    // set title
                    res.locals.pageTitle = tag[0].tag_name;

                    Promise
                        .all([post_model.byTagId(tag_id, limit, offset),
                            post_model.mostView_Thumbnail(5),
                            post_model.countByTag(tag_id)])
                        .then(([posts, mostView, postCount]) => {
                            if (posts.length === 0) {
                                res.render('news/tags', {
                                    tag: tag[0],
                                    isExistsData: false,
                                    mostViews: mostView
                                })
                            } else {
                                // chỉnh sửa định dạng ngày
                                mostView = mostView.map((val, idx) => {
                                    val.date_posted = my_utils.toDateString(val.date_posted);
                                    return val;
                                });

                                posts = posts.map((val, idx) => {
                                    val.date_posted = my_utils.toDateTimeString(val.date_posted);
                                    return val;
                                })

                                // lấy tổng số post
                                let totalPost = postCount[0].total;

                                // tính toán số lượng page
                                let totalPage = 0;

                                totalPage = Math.ceil(totalPost / limit);

                                let arrPages = [];

                                for (var i = 1; i <= totalPage; i++) {
                                    var obj = {
                                        page: i,
                                        isActive: i === +page
                                    }

                                    arrPages.push(obj);
                                }

                                Promise
                                    .all(
                                        posts.map((val, idx) => {
                                            return tag_model.getTagsByPostId(val.id);
                                        })
                                    )
                                    .then(values => {
                                        for (let i = 0; i < posts.length; i++) {
                                            posts[i].tags = values[i];
                                        }

                                        res.render('news/tags', {
                                            isExistsCat: true,
                                            isExistsData: true,
                                            tag: tag[0],
                                            posts: posts,
                                            mostViews: mostView,
                                            arrPages: arrPages
                                        })
                                    })
                                    .catch(next);
                            }
                        })
                        .catch(next);
                }

            })
            .catch(next);
    }
});

module.exports = router;