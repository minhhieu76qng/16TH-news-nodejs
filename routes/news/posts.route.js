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
                            console.log(new Date().toTimeString());
                            console.log(comments);
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

module.exports = router;