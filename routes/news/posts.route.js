var express = require('express');

var post_model = require('../../models/post.model');
var tag_model = require('../../models/tag.model');

var my_utils = require('../../utils/myUtils');

var router = express.Router();

router.get('/:id', (req, res, next) => {

    var post_id = +req.params.id;

    if (isNaN(post_id)) {
        throw new Error('Post ID is not valid.');
    } else {
        post_model
            .detailByPostId(post_id)
            .then(detail => {
                if (detail.length === 0) {
                    // khong ton tai du lieu
                    // res.render()
                } else {

                    let post = detail[0];

                    // nếu bài viết không phải free thì phải đăng nhập
                    // redirect về trang đăng nhập và hiện thông báo
                    if (post.type_post !==0 && !req.user){
                        req.flash('msg_warning', 'Đăng nhập để có thể xem bài viết premium.');

                        return res.redirect(`/account/login?retUrl=${req.originalUrl}`);
                    }

                    // nếu bài viết không phải free và cần quyền xem
                    if (post.type_post !== 0 && req.user && req.user.type === 'NORMAL'){
                        // redirect về trang đăng nhập và hiện thông báo
                        res.locals.pageTitle = 'Thông báo'
                        return res.render('notify', {
                            msg_title : 'Bạn chưa có quyền để xem tin tức này.',
                            msg_detail : 'Vui lòng liên hệ admin để gia hạn tài khoản.'
                        })
                    }

                    let id_category = post.id_category;

                    // set title
                    res.locals.pageTitle = post.title;

                    // lay cac bai viet cung chuyen muc
                    // lay cac the
                    // lay cac comment

                    Promise
                        .all([
                            post_model.byCat(id_category, 5, 0),
                            tag_model.getTagsByPostId(post_id),
                            post_model.getCommentsByPost(post_id)
                        ])
                        .then(([postsInCategory, tags, comments]) => {

                            // sua ngay hien thi
                            detail[0].date_posted = my_utils.toDateTimeString(detail[0].date_posted);

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
                            res.render('news/posts', {
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