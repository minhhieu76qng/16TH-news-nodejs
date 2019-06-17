var exp = require('express');
var post_model = require('../../models/post.model');
var tag_model = require('../../models/tag.model');
var my_utils = require('../../utils/myUtils');
var categoryModel = require('../../models/category.model');
var post_tagModel = require('../../models/post_tag.model');
var post_actionModel = require('../../models/post_action.model');
var moment = require('moment');

var router = exp.Router();

router.get('/', (req, res, next) => {
    var page = req.query.page || 1;
    if (page < 1) page = 1;

    var limit = 10;
    var offset = (page - 1) * limit;


    Promise.all([
        post_model.getListByStatus(3, limit, offset),//3: trạng thái bị từ chối
        post_model.countByStatus(3),
    ]).then(([rows, count_rows]) => {
        var total = count_rows[0].total;
        var nPages = Math.floor(total / limit);
        if (total % limit > 0) nPages++;
        var pages = [];
        for (i = 1; i <= nPages; i++) {
            var obj = { value: i, active: i === +page };
            pages.push(obj);
        }

        res.render('management/admin/vWPosts/denied_news.hbs', {
            posts: rows,
            pages
        });
    }).catch(next);
})

router.get('/detail/:id', (req, res, next) => {

    // lấy thông báo
    const msg_type = req.flash('msg_type');
    const msg = req.flash('msg');

    var post_id = +req.params.id;

    if (isNaN(post_id)) {
        throw new Error('Post ID is not valid.');
    } else {

        Promise
            .all([
                post_model.getDetailByID(post_id),
                categoryModel.rootCat(),
                categoryModel.exceptRootCat(),
                tag_model.getList(100, 0), //limit: 100 offset: 0
                post_actionModel.byPostID(post_id)
            ])
            .then(([detail, rootCat, childCat, tagRows, post_action]) => {
                if (detail.length === 0) {
                    res.locals.pageTitle = 'Thông báo'
                    return res.render('notify', {
                        msg_title: 'Bài viết không tồn tại.',
                        msg_detail: 'Bài viết này hiện đã không còn tồn tại trong máy chủ.'
                    })
                } else {
                    let post = detail[0];

                    let id_category = post.id_category;

                    // set title
                    res.locals.pageTitle = post.title;

                    Promise
                        .all([
                            tag_model.getTagsByPostId(post_id),
                        ])
                        .then(([tags]) => {

                            // sua ngay hien thi
                            post.date_created = my_utils.toDateTimeString(post.date_created);
                            //Phân level chuyên mục
                            //chuyên mục cha sẽ chứa id, tên, và dánh sách chuyên mục con
                            //chuyên mục con sẽ chứa id, tên, và biến selected có phải là chuyên mục của bài viết hay không
                            var rootCategories = [];
                            for (i = 0; i < rootCat.length; i++) {
                                var childCategories = [];
                                for (j = 0; j < childCat.length; j++) {
                                    if (rootCat[i].id === childCat[j].parent_cat) {
                                        var obj = {
                                            id: childCat[j].id,
                                            cat_name: childCat[j].cat_name,
                                            selected: post.id_category === childCat[j].id
                                        };
                                        childCategories.push(obj);
                                    }
                                }
                                var obj = {
                                    id: rootCat[i].id,
                                    cat_name: rootCat[i].cat_name,
                                    childCategories: childCategories
                                };
                                rootCategories.push(obj);
                            }
                            //tag của bài viết trong rowsTag sẽ được gán selected = true
                            var listTags = [];
                            for (i = 0; i < tagRows.length; i++) {
                                var selected = false;
                                for (j = 0; j < tags.length; j++) {
                                    if (tagRows[i].id === tags[j].id) {
                                        selected = true;
                                        break;
                                    }
                                }
                                var obj = {
                                    id: tagRows[i].id,
                                    tag_name: tagRows[i].tag_name,
                                    selected
                                };
                                listTags.push(obj);
                            }

                            return res.render('management/admin/vWPosts/detail_denied_news.hbs', {
                                post: post,
                                tags: tags,
                                msgToView: {
                                    msg_type: msg_type,
                                    msg: msg
                                },
                                is_premium: post.type_post === 1,
                                rootCategories,
                                listTags,
                                reason_deny: post_action[0].note
                            });
                        })
                        .catch(next)
                }
            })
            .catch(next);
    }
})

router.get('/detail/set-premium-true/:id', (req, res, next) => {
    var postID = req.params.id;
    var entity = {
        id: postID,
        type_post: 1 // type_post: 1 là premium
    }

    post_model.update(entity).then(n => {
        res.redirect('/admin/detail/' + postID);
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    })
        .catch(next);
})

router.get('/detail/set-premium-false/:id', (req, res, next) => {
    var postID = req.params.id;
    var entity = {
        id: postID,
        type_post: 0 // type_post: 0 là bình thường
    }

    post_model.update(entity).then(n => {
        res.redirect('/admin/detail/' + postID);
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    })
        .catch(next);
})

router.post('/detail/accept/:id', (req, res, next) => {
    var post_id = req.params.id;
    var date_posted = req.body.date_posted;
    var post_category = req.body.post_category;
    var post_tags = req.body.post_tags;

    //cập nhập ngày xuất bản và chuyên mục bài viết, tình trạng bài viết
    var entity = {
        id: post_id,
        date_posted: moment(date_posted, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm'),
        id_category: post_category,
        id_status: 1
    }

    var current = new Date();
    var post_action = {
        id_post: post_id,
        id_status: 1,
        id_user: 6, //lấy user id sau khi đăng nhập
        date_modified: moment(current).format('YYYY-MM-DD HH:mm')
    }
    //thêm promise add cái post_action
    Promise.all([
        post_model.update(entity),
        post_actionModel.add(post_action)
    ]).then(([value1, value2]) => {
        //xóa các tag của bài viết hiện tại
        post_tagModel.deleteByID(post_id)
            .then(value => {
                //gán lại các tag cho bài viết
                //dễ gặp bug đa luồng
                var pos = 0;
                for (i = 0; i < post_tags.length; i++) {
                    var obj = {
                        id_post: post_id,
                        id_tag: post_tags[i]
                    };
                    pos++;
                    if (pos === post_tags.length) {
                        post_tagModel.add(obj)
                            .then(id => {
                                res.redirect('/admin');
                            })
                            .catch(next);
                    }
                    else {
                        post_tagModel.add(obj)
                            .then(id => {
                            })
                            .catch(next);
                    }
                }
            }).catch(next);
    }).catch(next);
})


module.exports = router;