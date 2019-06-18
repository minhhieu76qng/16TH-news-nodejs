var exp = require('express');
var router = exp.Router();

var multer = require('multer');
var moment = require('moment');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploaded/')
    },
    filename: function (req, file, cb) {
        const filter = ['.png', '.jpg', '.jpeg', '.pdf'];
        let filename = '';

        filename = file.originalname;

        filter.map(val => {
            if (file.originalname.endsWith(val)) {
                filename = file.originalname.replace(val, '') + '-' + Date.now() + val;
            }
        })

        cb(null, filename);
    }
})

var upload = multer({ storage });

var uploadText = multer();

var category_model = require('../../models/category.model');
var tag_model = require('../../models/tag.model');
var user_model = require('../../models/user.model');
var post_model = require('../../models/post.model');
var post_status_model = require('../../models/post_status.model');
var post_tag_model = require('../../models/post_tag.model');

router.get('/', (req, res, next) => {
    res.redirect('/writer/add-new-post');
});

router.get('/add-new-post', (req, res, next) => {
    res.locals.pageTitle = "Thêm bài viết mới.";
    const UserID = req.user.id;

    // get mesage
    const msg_type = req.flash('msg_type');
    const msg = req.flash('msg');

    user_model.detailUserByID(UserID)
        .then(users => {
            if (users.length === 0) {
                // không tồn tại user
                return res.render('notify', {
                    msg_title: 'Không tồn tại tài khoản.',
                    msg_detail: 'Tài khoản bạn đã đăng nhập không còn tồn tại.'
                })
            }

            if (users[0].type !== 'WRITER') {
                return res.render('notify', {
                    msg_title: 'Không thể truy cập trang này.',
                    msg_detail: 'Tài khoản của bạn không có quyền truy cập trang này.'
                })
            }

            Promise
                .all([
                    category_model.exceptRootCat(),
                    tag_model.all(),
                ])
                .then(([categories, tags]) => {

                    res.render('management/writer/writer_add', {
                        categories: categories,
                        tags: tags,
                        msg: {
                            msg_type: msg_type,
                            message: msg
                        }
                    });
                })
                .catch(next)
        })
        .catch(next)
})

router.post('/add-new-post', uploadText.none(), (req, res, next) => {

    const UserID = req.user.id;

    let form_fields = req.body;

    user_model.detailUserByID(UserID)
        .then(users => {
            if (users.length === 0) {
                // không tồn tại user
                return res.render('notify', {
                    msg_title: 'Không tồn tại tài khoản.',
                    msg_detail: 'Tài khoản bạn đã đăng nhập không còn tồn tại.'
                })
            }

            if (users[0].type !== 'WRITER') {
                return res.render('notify', {
                    msg_title: 'Không thể truy cập trang này.',
                    msg_detail: 'Tài khoản của bạn không có quyền truy cập trang này.'
                })
            }

            let entity_post = {
                title: form_fields.post_title,
                date_created: moment(new Date()).format('YYYY/MM/DD HH:mm'),
                cover_image: form_fields.cover_image_uploaded,
                abstract: form_fields.summary_content_post,
                content: form_fields.content_post,
                id_writer: users[0].id,
                id_status: 4,
                id_category: form_fields.post_category,
                type_post: form_fields.post_type === 'normal' ? 0 : 1,
                views: 0,
                download_link: form_fields.file_uploaded !== "" ? form_fields.file_uploaded : null,
            }

            if (form_fields.post_type === 'normal') {
                entity_post.type_post = 0;
            }

            if (form_fields.post_type === 'premium') {
                entity_post.type_post = 1;
            }

            post_model.add(entity_post)
                .then(postId => {
                    if (Number.isInteger(postId)) {
                        // thêm các tag vào post_tag
                        Promise
                            .all(
                                Array.from(form_fields.insert_tags).map(val => {
                                    let entity_post_tag = {
                                        id_post: postId,
                                        id_tag: val
                                    };
                                    return post_tag_model.add(entity_post_tag);
                                })
                            )
                            .then(tagIds => {
                                if (tagIds.length > 0) {
                                    // thêm thành công
                                    // return res.render('management/writer/writer.view.hbs', {
                                    //     msg : {
                                    //         msg_type : 'success',
                                    //         message : 'Thêm bài viết thành công.'
                                    //     }
                                    // })
                                    req.flash('msg_type', 'success');
                                    req.flash('msg', 'Thêm bài viết thành công.');
                                    return res.redirect('/writer/add-new-post');
                                }

                                // return res.render('management/writer/writer.view.hbs', {
                                //     msg : {
                                //         msg_type : 'danger',
                                //         message : 'Thêm bài viết không thành công.'
                                //     }
                                // })

                                req.flash('msg_type', 'success');
                                req.flash('msg', 'Thêm bài viết thành công.');
                                return res.redirect('/writer/add-new-post');
                            })
                            .catch(next)
                    }
                })
                .catch(next)
        })
        .catch(next)
})

router.get('/view-posts', (req, res, next) => {
    res.locals.pageTitle = 'Các bài viết';

    let status_display = +req.query.post_status || 0;


    if (!Number.isInteger(status_display)) {
        return next();
    }

    const UserID = req.user.id;

    Promise
        .all([
            user_model.detailUserByID(UserID),
            post_status_model.all()
        ])
        .then(([users, post_status]) => {

            if (users.length === 0) {
                // không tồn tại user
                return res.render('notify', {
                    msg_title: 'Không tồn tại tài khoản.',
                    msg_detail: 'Tài khoản bạn đã đăng nhập không còn tồn tại.'
                })
            }

            if (users[0].type !== 'WRITER') {
                return res.render('notify', {
                    msg_title: 'Không thể truy cập trang này.',
                    msg_detail: 'Tài khoản của bạn không có quyền truy cập trang này.'
                })
            }

            let User = users[0];

            const list_status_id = post_status.map(val => val.id);

            if (status_display !== 0) {
                if (typeof Array.from(list_status_id).find((val) => val === status_display) === 'undefined') {
                    return next();
                }
            }

            let list_status = post_status;
            list_status.unshift({
                id: 0,
                status_name: 'Tất cả'
            })

            list_status = list_status.map(val => {
                if (val.id === status_display) {
                    val.isActive = true;
                }
                return val;
            })

            let page = +req.query.p || 1;
            const limit = 8;

            let offset = (page - 1) * limit;

            Promise
                .all([
                    status_display === 0 ? post_model.postsWithAuthorID(User.id, limit, offset) : Promise.resolve,
                    status_display === 1 ? post_model.waitingForPublicationPostsWithUserID(User.id, limit, offset) : Promise.resolve,
                    status_display === 2 ? post_model.publishedPostsWithUserID(User.id, limit, offset) : Promise.resolve,
                    status_display === 3 ? post_model.refusedPostsWithUserID(User.id, limit, offset) : Promise.resolve,
                    status_display === 4 ? post_model.createdPostsWithUserID(User.id, limit, offset) : Promise.resolve,

                    status_display === 0 ? post_model.countAllPostWithUserID(User.id) : Promise.resolve,
                    status_display === 1 ? post_model.countWaitingPostWithUserID(User.id) : Promise.resolve,
                    status_display === 2 ? post_model.countPublishedPostWithUserID(User.id) : Promise.resolve,
                    status_display === 3 ? post_model.countRefusedPostWithUserID(User.id) : Promise.resolve,
                    status_display === 4 ? post_model.countCreatedPostWithUserID(User.id) : Promise.resolve,
                ])
                .then(values => {
                    let posts = values[status_display];

                    const arrBadges = [
                        {
                            badge: 'primary',
                            text: list_status[1].status_name
                        },
                        {
                            badge: 'success',
                            text: list_status[2].status_name
                        },
                        {
                            badge: 'danger',
                            text: list_status[3].status_name
                        },
                        {
                            badge: 'secondary',
                            text: list_status[4].status_name
                        }
                    ]

                    // thêm nhãn trạng thái
                    switch (status_display) {
                        case 0:
                            posts = posts.map(val => {
                                const now = new Date();

                                if (val.id_status === 1 && val.date_posted !== null){
                                    const date_posted = new Date(val.date_posted);
                                    if (date_posted <= now){
                                        val.post_status = arrBadges[1]
                                    } else {
                                        val.post_status = arrBadges[0]
                                    }
                                }

                                if (val.id_status === 3){
                                    val.post_status = arrBadges[2];
                                }
                                
                                if (val.id_status === 4){
                                    val.post_status = arrBadges[3];
                                }
                                
                                return val;
                            })
                            break;
                        case 1:
                            posts = posts.map(val => {
                                val.post_status = arrBadges[0]
                                return val;
                            })
                            break;
                        case 2:
                            posts = posts.map(val => {
                                val.post_status = arrBadges[1]
                                return val;
                            })
                            break;
                        case 3:
                            posts = posts.map(val => {
                                val.post_status = arrBadges[2]
                                return val;
                            })
                            break;
                        case 4:
                            posts = posts.map(val => {
                                val.post_status = arrBadges[3]
                                return val;
                            })
                            break;

                    }

                    // chỉnh sửa ngày hiển thị
                    posts = posts.map(val => {
                        val.date_created = moment(val.date_created).format('DD/MM/YYYY HH:mm');
                        if (val.date_posted !== null){
                            val.date_posted = moment(val.date_posted).format('DD/MM/YYYY HH:mm');
                        }else {
                            val.date_posted = 'null';
                        }
                        return val;
                    })

                    let count = values[status_display + 1 + 4][0].total;

                    let totalPage = Math.ceil(count / limit);

                    let arrPaging = [];

                    for (var i = 1; i <= totalPage; i++) {
                        arrPaging.push({
                            page: i,
                            isActive: page === i ? true : false,
                            post_status: status_display
                        });
                    }

                    return res.render('management/writer/writer_view_posts', {
                        status: list_status,
                        posts: posts,
                        post_status: status_display,
                        paging: arrPaging,
                        currentPage: page,
                        next: {
                            isActive: page < totalPage ? true : false,
                            val: page < totalPage ? page + 1 : totalPage
                        },
                        prev: {
                            isActive: page > 1 ? true : false,
                            val: page > 1 ? page - 1 : 1
                        },
                    });
                })
                .catch(next)
        })
        .catch(next)
})

router.post('/upload-file', (req, res, next) => {
    upload.single('edition')(req, res, err => {
        if (err) {
            return res.json({
                error: err
            })
        }

        return res.json({
            fileName: req.file.filename,
            destination: req.file.destination
        })
    })
})

module.exports = router;