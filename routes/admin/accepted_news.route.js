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

    //lấy ngày hiện tại
    //trạng thái đã duyệt đang chờ xuất bản, xét currentDate > date_posted
    var current = new Date();
    var currentDate = moment(current).format('YYYY-MM-DD HH:mm');
    Promise.all([
        post_model.getAcceptPost(currentDate,limit, offset),
        post_model.countAcceptPost(currentDate),
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
            ])
            .then(([detail]) => {
                if (detail.length === 0) {
                    res.locals.pageTitle = 'Thông báo'
                    return res.render('notify', {
                        msg_title: 'Bài viết không tồn tại.',
                        msg_detail: 'Bài viết này hiện đã không còn tồn tại trong máy chủ.'
                    })
                } else {
                    let post = detail[0];

                    // set title
                    res.locals.pageTitle = post.title;

                    Promise
                        .all([
                            tag_model.getTagsByPostId(post_id),
                        ])
                        .then(([tags]) => {

                            // sua ngay hien thi
                            post.date_posted = my_utils.toDateTimeString(post.date_posted);

                            return res.render('management/admin/vWPosts/detail_accepted_published_news.hbs', {
                                post: post,
                                tags: tags,
                                msgToView: {
                                    msg_type: msg_type,
                                    msg: msg
                                },
                                is_premium: post.type_post === 1,
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

router.get('/detail/delete/:id', (req, res) => {
    var postID = req.params.id;
    var entity = {
        id: postID,
        is_deleted: 1
    }

    post_model.update(entity).then(n => {
        res.redirect('/admin');
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    });
})

module.exports = router;