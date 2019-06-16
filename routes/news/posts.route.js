var express = require('express');
var moment = require('moment');

var post_model = require('../../models/post.model');
var tag_model = require('../../models/tag.model');
var view_weeks_model = require('../../models/view_weeks.model');
var user_model = require('../../models/user.model');
var my_utils = require('../../utils/myUtils');
var comment_model = require('../../models/comment.model');

var router = express.Router();

router.get('/:id', (req, res, next) => {

    const limitComment = 3;
    let offsetComment = 0;

    // lấy thông báo
    const msg_type = req.flash('msg_type');
    const msg = req.flash('msg');

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
                            // req.flash('msg_warning', 'Đăng nhập để có thể xem bài viết premium.');
                            req.flash('msg_type', 'warning');
                            req.flash('msg', 'Đăng nhập để có thể xem bài viết premium.');

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
                        if (user.type === 'SUBSCRIBER') {
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
                            comment_model.count(post_id),
                            post_model.byCat(id_category, 5, 0),
                            tag_model.getTagsByPostId(post_id),
                            comment_model.withPostID(post_id, limitComment, offsetComment),
                            post_model.increaseViews(entityTotalView),
                            view_weeks_model.withPostIDAndWeek(post.id, beginOfWeek)
                        ])
                        .then(([commentCount, postsInCategory, tags, comments, totalViewRows, post_viewInWeek]) => {

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
                                comments: {
                                    listComment: comments,
                                    isViewMoreComment:
                                         +commentCount[0].totalComment > limitComment * 1 ? true : false,
                                    commentPage : 1
                                },
                                msgToView: {
                                    msg_type: msg_type,
                                    msg: msg
                                },

                            });
                        })
                        .catch(next)
                }
            })
            .catch(next);
    }
});


router.post('/:id/comment', (req, res, next) => {

    const post_url = `${req.baseUrl}/${req.params.id}`;
    if (!req.user) {
        // redirect về trang login với retURL
        req.flash('msg_type', 'warning');
        req.flash('msg', 'Bạn cần đăng nhập để bình luận.');
        // req.flash('msg_warning', 'Bạn cần đăng nhập để bình luận.');
        return res.redirect(`/account/login?retUrl=${post_url}`);
    }

    const UserID = req.user.id;

    // get id của post hiện tại
    const post_id = +req.params.id;

    // get content 
    let comment = req.body.comment;

    // get date submit
    let date_submit = moment(new Date()).format('YYYY/MM/DD HH:mm');

    let entity_comment = {
        id_user: UserID,
        id_post: post_id,
        content: comment,
        date_submit: date_submit
    };

    comment_model.addNewComment(entity_comment)
        .then(comment_id => {

            if (Number.isInteger(comment_id)) {
                req.flash('msg_type', 'success');
                req.flash('msg', 'Thêm bình luận mới thành công.');

                return res.redirect(post_url + '#frm_add_new_comment');
            } else {
                req.flash('msg_type', 'danger');
                req.flash('msg', 'Thêm bình luận không thành công.');
                return res.redirect(post_url + '#frm_add_new_comment');
            }
        })
        .catch(err => {
            req.flash('msg_type', 'danger');
            req.flash('msg', 'Thêm bình luận không thành công.');
            return res.redirect(post_url + '#frm_add_new_comment');
        });

    // return res.redirect(post_url);
});

router.get('/:id/comment', (req, res, next) => {
    const postID = +req.params.id;
    const limit = 3;
    let commentPage = req.query.commentPage || null;
    commentPage = +commentPage;

    if (!Number.isInteger(postID)){
        res.setHeader('Content-Type', 'application/json');
        return res.json({
            status : false,
            msg : 'PostID bị sai.'
        })
    }

    if (!Number.isInteger(commentPage)){
        return res.json({
            status : false,
            msg : 'Offset bị sai.'
        })
    }

    // sang trang tiep theo
    ++commentPage;

    let offset = limit * (commentPage - 1);

    Promise.all([
        comment_model.count(postID),
        comment_model.withPostID(postID, limit, offset)
    ])
    .then(([totalComment, rows]) => {

        if (rows.length == 0){
            return res.json({
                status : false,
            })
        } else {

            const commentCount = totalComment[0].totalComment;

            rows = rows.map((val, idx) => {
                val.date_submit = moment(val.date_submit).format('DD/MM/YYYY HH:mm');
                return val;
            })
            return res.json({
                status : true,
                comments : rows,
                commentPage : commentPage,
                nextPage : commentCount > (offset + limit) ? true : false
            })
        }
    })
    .catch(err => {
        return res.json({
            status : false,
            msg : err.message
        })
    })
})

module.exports = router;