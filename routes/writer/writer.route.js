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
            if (file.originalname.endsWith(val)){
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
var post_tag_model = require('../../models/post_tag.model');

router.get('/', (req, res, next) => {
    res.locals.pageTitle = "Dashboard";

    const UserID = req.user.id;

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

            // load chuyên mục
            // load nhãn
            // lấy danh sách tất cả các bài viết do writer này
            Promise
                .all([
                    category_model.exceptRootCat(),
                    tag_model.all(),
                ])
                .then(([categories, tags]) => {

                    res.render('management/writer/writer.view.hbs', {
                        categories: categories,
                        tags: tags
                    });
                })
                .catch(next)
        })
        .catch(next)
});

router.post('/add-new-post', uploadText.none(), (req, res, next) => {
    res.locals.pageTitle = "Dashboard";

    const UserID = req.user.id;

    let form_fields = req.body;
    console.log(form_fields);

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
                cover_image : form_fields.cover_image_uploaded,
                abstract : form_fields.summary_content_post,
                content : form_fields.content_post,
                id_writer : users[0].id,
                id_status : 4,
                id_category : form_fields.post_category,
                type_post : form_fields.post_type === 'normal' ? 0 : 1,
                views : 0,
                download_link : form_fields.file_uploaded !== "" ? form_fields.file_uploaded : null,
            }

            if (form_fields.post_type === 'normal') {
                entity_post.type_post = 0;
            }
            
            if (form_fields.post_type === 'premium') {
                entity_post.type_post = 1;
            }

            post_model.add(entity_post)
                .then(postId => {
                    if (Number.isInteger(postId)){
                        // thêm các tag vào post_tag
                        Promise
                            .all(
                                Array.from(form_fields.insert_tags).map(val => {
                                    let entity_post_tag = {
                                        id_post : postId,
                                        id_tag : val
                                    };
                                    return post_tag_model.add(entity_post_tag);
                                })
                            )
                            .then(tagIds => {
                                if (tagIds.length > 0){
                                    // thêm thành công
                                    return res.render('management/writer/writer.view.hbs', {
                                        msg : {
                                            msg_type : 'success',
                                            message : 'Thêm bài viết thành công.'
                                        }
                                    })
                                }

                                return res.render('management/writer/writer.view.hbs', {
                                    msg : {
                                        msg_type : 'danger',
                                        message : 'Thêm bài viết không thành công.'
                                    }
                                })
                            })
                            .catch(next)
                    }
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