var express = require('express');
var category_model = require('../../models/category.model');
var post_model = require('../../models/post.model');
var tag_model = require('../../models/tag.model');

var my_utils = require('../../utils/myUtils');

var router = express.Router();

router.get('/:id/posts', (req, res, next) => {

    let limit = 7, offset = 0;

    let page = req.query.page || 1;

    if (page < 1){
        page = 1;
    }

    offset = limit * (page - 1);

    // kiểm tra cat_id này có tồn tại hay không

    let cat_id = +req.params.id;

    if (isNaN(cat_id)) {
        throw new Error('Category ID is not valid.');
    } else {
        category_model.getCategoryById(cat_id)
            .then(category => {

                if (category.length === 0) {
                    next();
                } else {
                    // set title
                    res.locals.pageTitle = category[0].cat_name;

                    // chỉnh sửa active menu hiện tại
                    for (const c of res.locals.lcCategories){
                        if (c.root.id === cat_id){
                            c.root.isActive = true;
                        }
                    }

                    // nếu parent_cat = null. thì phải tìm hết tất cả những bài viết.
                    Promise
                        .all([
                            category[0].parent_cat === null
                                ? post_model.byRootCat(cat_id, limit, offset)
                                : post_model.byCat(cat_id, limit, offset),
                            post_model.mostView_Thumbnail(5),
                            category[0].parent_cat === null
                                ? tag_model.getRelatedTagsByCatID_Root(cat_id, 10)
                                : tag_model.getRelatedTagsByCatID(cat_id, 10),
                            category[0].parent_cat === null
                                ? post_model.countByRootCat(cat_id)
                                : post_model.countByCat(cat_id)
                        ])
                        .then(([posts, mostView, relatedTags, postCount]) => {
                            if (posts.length === 0) {
                                res.render('news/categories', {
                                    cat: category[0],
                                    isExistsData: false,
                                    mostViews: mostView,
                                    tags: relatedTags,
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

                                for (var i = 1; i <= totalPage; i++){
                                    var obj = {
                                        page : i,
                                        isActive : i === +page
                                    }

                                    arrPages.push(obj);
                                }

                                // trong từng post. lấy ra id của nó và query lấy danh sách các tags
                                Promise
                                    .all(
                                        posts.map((val, idx) => {
                                            return tag_model.getTagsByPostId(val.id);
                                        })
                                    )
                                    .then(values => {
                                        for (let i = 0; i < posts.length; i++){
                                            posts[i].tags = values[i];
                                        }

                                        res.render('news/categories', {
                                            isExistsCat: true,
                                            isExistsData: true,
                                            cat: category[0],
                                            posts: posts,
                                            mostViews: mostView,
                                            tags: relatedTags,
                                            arrPages : arrPages
                                        })
                                    })
                                    .catch(next);
                            }
                        })
                        .catch(next)
                }
            })
            .catch(next)
    }
});

module.exports = router;