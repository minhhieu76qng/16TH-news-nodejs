var express = require('express');
var moment = require('moment');

var post_model = require('../../models/post.model');
var tag_model = require('../../models/tag.model');
var view_weeks_model = require('../../models/view_weeks.model');
var user_model = require('../../models/user.model');
var my_utils = require('../../utils/myUtils');

var router = express.Router();

router.get('/:id', (req, res, next) => {

    var post_id = +req.params.id;

    if (isNaN(post_id)) {
        throw new Error('Post ID is not valid.');
    } else {

        let UserID = null;

        if (req.user) {
            UserID = req.user.id;
        }

        Promise
            .all([
                post_model.detailByPostId(post_id),
                req.user ? user_model.detailUserByID(UserID) : Promise.resolve()
            ])
            .then(([detail, arrUser]) => {
                if (detail.length === 0) {
                    res.locals.pageTitle = 'Thông báo'
                    return res.render('notify', {
                        msg_title: 'Bài viết không tồn tại.',
                        msg_detail: 'Bài viết này hiện đã không còn tồn tại trong máy chủ.'
                    })
                } else {
                    let post = detail[0];

                    if (post.type_post !== 0) {
                        if (!req.user || arrUser === 'undefined') {    // tức là bằng với Promise.resolve => undefined
                            req.flash('msg_warning', 'Đăng nhập để có thể xem bài viết premium.');

                            return res.redirect(`/account/login?retUrl=${req.originalUrl}`);
                        }

                        if (arrUser.length === 0) {
                            // không tồn tại người dùng => có thể đã bị xóa sau khi người đó đăng nhập
                            res.locals.pageTitle = 'Thông báo'
                            return res.render('notify', {
                                msg_title: 'Tài khoản của bạn bị lỗi.',
                                msg_detail: 'Vui lòng liên hệ admin để khắc phục.'
                            })

                        }

                        let user = arrUser[0];
                        if (user.type === 'SUBCRIBER') {
                            // kiểm tra ngày hết hạn
                            const now = new Date();
                            const exp_date = new Date(user.exp_date);

                            if (user.exp_date === null || now > exp_date) {
                                // tài khoản hết hạn
                                res.locals.pageTitle = 'Thông báo'
                                return res.render('notify', {
                                    msg_title: 'Bạn chưa có quyền để xem tin tức này.',
                                    msg_detail: 'Tài khoản của bạn dường như đã hết hạn. Vui lòng liên hệ admin để gia hạn tài khoản.'
                                })
                            }

                        }
                    }

                    let id_category = post.id_category;

                    // set title
                    res.locals.pageTitle = post.title;

                    // lay cac bai viet cung chuyen muc
                    // lay cac the
                    // lay cac comment
                    // lấy số lượng view week của post này
                    let beginOfWeek = moment(my_utils.getBeginOfWeek()).format('YYYY/MM/DD');

                    // tăng lượt view tổng
                    let totalView = post.views + 1;
                    let entityTotalView = {
                        id: post.id,
                        views: totalView
                    }

                    Promise
                        .all([
                            post_model.byCat(id_category, 5, 0),
                            tag_model.getTagsByPostId(post_id),
                            post_model.getCommentsByPost(post_id),
                            post_model.increaseViews(entityTotalView),
                            view_weeks_model.withPostIDAndWeek(post.id, beginOfWeek)
                        ])
                        .then(([postsInCategory, tags, comments, totalViewRows, post_viewInWeek]) => {

                            // sua ngay hien thi
                            post.date_posted = my_utils.toDateTimeString(post.date_posted);

                            postsInCategory = postsInCategory.map((val, idx) => {
                                val.date_posted = my_utils.toDateString(val.date_posted);
                                return val;
                            })

                            comments = comments.map((val, idx) => {
                                val.date_submit = my_utils.toDateTimeString(val.date_submit);
                                return val;
                            })
                            // tao list comments

                            let comments_clone = comments.slice(0);

                            comments = comments.filter((val, idx) => val.id_parent === null);

                            comments = comments.map((val, idx) => {
                                if (val.id_parent === null) {
                                    val.child_comments = comments_clone.filter((value, index) => value.id_parent === val.comment_id);
                                    val.child_comments = val.child_comments.sort(
                                        (comment1, comment2) => new Date(comment1.date_submit) - new Date(comment2.date_submit)
                                    );
                                }

                                return val;
                            });

                            if (post_viewInWeek.length === 0) {
                                // tạo ra 1 trường mới
                                let entity = {
                                    id_post: post.id,
                                    week: beginOfWeek,
                                    views_in_week: 1
                                };
                                view_weeks_model.createViewInWeek(entity).then(rows => { }).catch(next);
                            } else {
                                // post_viewInWeek[0].views_in_week
                                let entity = {
                                    id: post_viewInWeek[0].id,
                                    views_in_week: ++post_viewInWeek[0].views_in_week
                                }
                                view_weeks_model.increaseViews(entity).then(rows => { }).catch(next);
                            }

                            return res.render('news/posts', {
                                post: post,
                                tags: tags,
                                postsInCategory: postsInCategory,
                                comments: comments
                            });
                        })
                        .catch(next)
                }
            })
            .catch(next);
    }
});


router.post('/:id/comment', (req, res, next) => {

    // get id của use hiện tại

    // kiêm tra xem đã đăng nhập chưa. nếu chưa thì redirect về login

    // get id của post hiện tại
    let post_id = +req.params.id;

    // get content 
    let comment = req.body.comment;

    // get date submit
    let date_submit = new Date();



    res.redirect(req.baseUrl + '/' + req.params.id);
})

module.exports = router;