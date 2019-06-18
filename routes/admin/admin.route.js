var exp = require('express');

var categoryModel = require('../../models/category.model');
var tag_model = require('../../models/tag.model');
var post_model = require('../../models/post.model');
var post_tagModel = require('../../models/post_tag.model');
var post_actionModel = require('../../models/post_action.model');
var user_model = require('../../models/user.model');
var account_type = require('../../models/user_type.model');
var user_account_type = require('../../models/user_account_type.model');
var user_cat = require('../../models/user_category.model');

var bcrypt = require('bcrypt');
var my_utils = require('../../utils/myUtils');
var moment = require('moment');


var router = exp.Router();

//Phân quản lý category ----------------------------------------------------------
//#region
router.get('/', (req, res, next) => {
    var page = req.query.page || 1;
    if (page < 1) page = 1;

    var limit = 10;
    var offset = (page - 1) * limit;


    Promise.all([
        categoryModel.pageCat(limit, offset),
        categoryModel.count(),
        categoryModel.rootCat()
    ]).then(([rows, count_rows, rootCat]) => {
        for (i = 0; i < rows.length; i++) {
            if (rows[i].parentCat === null) {
                Promise.all([categoryModel.countPostRootCat(rows[i].id), i])
                    .then(([values, pos]) => {
                        rows[pos].numPosts = values[0].nPosts;
                    }).catch(next);
            }
        }
        var total = count_rows[0].total;
        var nPages = Math.floor(total / limit);
        if (total % limit > 0) nPages++;
        var pages = [];
        for (i = 1; i <= nPages; i++) {
            var obj = { value: i, active: i === +page };
            pages.push(obj);
        }

        res.render('management/admin/vWCategories/categories.hbs', {
            categories: rows,
            rootCategories: rootCat,
            pages
        });
    }).catch(next);
})

router.get('/is-available', (req, res, next) => {
    var cat_name = req.query.cat_name;
    var id = req.query.id;
    Promise.all(
        [categoryModel.singleByCatName(cat_name, id)]).then(([rows]) => {
            if (rows.length > 0) {
                return res.json(false);
            }
            return res.json(true);
        }).catch(next);
})

router.post('/add', (req, res,next) => {
    categoryModel.add(req.body).then(id => {
        // console.log(id);
        //res.render('admin/vwCategories/add');
        res.redirect('/admin');
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    });
})

router.post('/update', (req, res,next) => {
    categoryModel.update(req.body).then(n => {
        //res.redirect('/admin/categories');
        res.redirect('/admin');
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    });
})

router.get('/delete/:id', (req, res,next) => {
    var catID = req.params.id;
    var entity = {
        id: catID,
        is_deleted: 1
    }

    categoryModel.update(entity).then(n => {
        //res.redirect('/admin/categories');
        res.redirect('/admin');
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    });
})
//#endregion


//------------------------------- Quản lý nhãn tag -------------------------------------
//#region 
router.get('/tag', (req, res, next) => {
    var page = req.query.page || 1;
    if (page < 1) page = 1;

    var limit = 10;
    var offset = (page - 1) * limit;


    Promise.all([
        tag_model.pageTag(limit, offset),
        tag_model.count(),
    ]).then(([rows, count_rows]) => {
        var total = count_rows[0].total;
        var nPages = Math.floor(total / limit);
        if (total % limit > 0) nPages++;
        var pages = [];
        for (i = 1; i <= nPages; i++) {
            var obj = { value: i, active: i === +page };
            pages.push(obj);
        }

        res.render('management/admin/vWTags/tags.hbs', {
            tags: rows,
            pages
        });
    }).catch(next);
})

router.get('/tag/is-available', (req, res, next) => {
    var tag_name = req.query.tag_name;
    var id = req.query.id;

    Promise.all(
        [tag_model.singleByTagName(tag_name, id)]).then(([rows]) => {
            if (rows.length > 0) {
                return res.json(false);
            }
            return res.json(true);
        }).catch(next);
})

router.post('/tag/add', (req, res) => {
    tag_model.add(req.body).then(id => {
        res.redirect('/admin/tag');
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    });
})

router.post('/tag/update', (req, res) => {
    tag_model.update(req.body).then(n => {
        res.redirect('/admin/tag');
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    });
})

router.get('/tag/delete/:id', (req, res) => {
    var tagID = req.params.id;
    var entity = {
        id: tagID,
        is_deleted: 1
    }

    tag_model.update(entity).then(n => {
        res.redirect('/admin/tag');
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    });
})
//#endregion



//----------------------- Bài viết chưa duyệt ------------------------------------
//#region
router.get('/not-accepted-news', (req, res, next) => {
    var page = req.query.page || 1;
    if (page < 1) page = 1;

    var limit = 10;
    var offset = (page - 1) * limit;


    Promise.all([
        post_model.getListByStatus(4, limit, offset),//4: trạng thái chưa duyệt
        post_model.countByStatus(4),
    ]).then(([rows, count_rows]) => {
        var total = count_rows[0].total;
        var nPages = Math.floor(total / limit);
        if (total % limit > 0) nPages++;
        var pages = [];
        for (i = 1; i <= nPages; i++) {
            var obj = { value: i, active: i === +page };
            pages.push(obj);
        }

        res.render('management/admin/vWPosts/not_accepted_news.hbs', {
            posts: rows,
            pages
        });
    }).catch(next);
})

router.get('/not-accepted-news/detail/:id', (req, res, next) => {

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
                tag_model.getList(100, 0) //limit: 100 offset: 0
            ])
            .then(([detail, rootCat, childCat, tagRows]) => {
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

                            return res.render('management/admin/vWPosts/detail_not_accepted_news.hbs', {
                                post: post,
                                tags: tags,
                                msgToView: {
                                    msg_type: msg_type,
                                    msg: msg
                                },
                                is_premium: post.type_post === 1,
                                rootCategories,
                                listTags
                            });
                        })
                        .catch(next)
                }
            })
            .catch(next);
    }
})

router.get('/not-accepted-news/detail/set-premium-true/:id', (req, res, next) => {
    var postID = req.params.id;
    var entity = {
        id: postID,
        type_post: 1 // type_post: 1 là premium
    }

    post_model.update(entity).then(n => {
        res.redirect('/admin/not-accepted-news/detail/' + postID);
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    })
        .catch(next);
})

router.get('/not-accepted-news/detail/set-premium-false/:id', (req, res, next) => {
    var postID = req.params.id;
    var entity = {
        id: postID,
        type_post: 0 // type_post: 0 là bình thường
    }

    post_model.update(entity).then(n => {
        res.redirect('/admin/not-accepted-news/detail/' + postID);
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    })
        .catch(next);
})

router.post('/not-accepted-news/detail/accept/:id', (req, res, next) => {
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
        id_user: 6,                                       //--------lấy user id sau khi đăng nhập-------
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
                                res.redirect('/admin/not-accepted-news/detail/' + post_id);
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

router.post('/not-accepted-news/detail/deny/:id', (req, res, next) => {
    var post_id = req.params.id;
    var reason_deny = req.body.reason_deny;

    //cập nhập tình trạng bài viết
    var entity = {
        id: post_id,
        id_status: 3 // bị từ chối
    }

    // Nhớ lấy id user

    var current = new Date();
    var post_action = {
        id_post: post_id,
        id_status: 3,
        id_user: 6, //lấy user id sau khi đăng nhập
        date_modified: moment(current).format('YYYY-MM-DD HH:mm'),
        note: reason_deny
    }
    //thêm promise add cái post_action
    Promise.all([
        post_model.update(entity),
        post_actionModel.add(post_action)
    ]).then(([value1, value2]) => {
        res.redirect('/admin/not-accepted-news');
    }).catch(next);
})

//#endregion


//------------------------ Bài viết chờ xuất bản ----------------------------------------
//#region
router.get('/accepted-news', (req, res, next) => {
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

router.get('/accepted-news/detail/:id', (req, res, next) => {

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

                            return res.render('management/admin/vWPosts/detail_accepted_news.hbs', {
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

router.get('/accepted-news/detail/set-premium-true/:id', (req, res, next) => {
    var postID = req.params.id;
    var entity = {
        id: postID,
        type_post: 1 // type_post: 1 là premium
    }

    post_model.update(entity).then(n => {
        res.redirect('/admin/accepted-news/detail/' + postID);
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    })
        .catch(next);
})

router.get('/accepted-news/detail/set-premium-false/:id', (req, res, next) => {
    var postID = req.params.id;
    var entity = {
        id: postID,
        type_post: 0 // type_post: 0 là bình thường
    }

    post_model.update(entity).then(n => {
        res.redirect('/admin/accepted-news/detail/' + postID);
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    })
        .catch(next);
})

router.get('/accepted-news/detail/delete/:id', (req, res) => {
    var postID = req.params.id;
    var entity = {
        id: postID,
        is_deleted: 1
    }

    post_model.update(entity).then(n => {
        res.redirect('/admin/accepted-news');
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    });
})

//#endregion

//------------------------ Bài viết đã xuất bản ----------------------------------------
//#region
router.get('/published-news', (req, res, next) => {
    var page = req.query.page || 1;
    if (page < 1) page = 1;

    var limit = 10;
    var offset = (page - 1) * limit;
    var current = new Date();
    var currentDate = moment(current).format('YYYY-MM-DD HH:mm');

    Promise.all([
        post_model.getPublishedPost(currentDate, limit, offset),//2: trạng thái đã xuất bản
        post_model.countPublishedPost(currentDate),
    ]).then(([rows, count_rows]) => {
        var total = count_rows[0].total;
        var nPages = Math.floor(total / limit);
        if (total % limit > 0) nPages++;
        var pages = [];
        for (i = 1; i <= nPages; i++) {
            var obj = { value: i, active: i === +page };
            pages.push(obj);
        }
        for (i = 0; i < rows.length; i++) {
            rows[i].date_posted = my_utils.toDateString(rows[i].date_posted)
        }
        res.render('management/admin/vWPosts/published_news.hbs', {
            posts: rows,
            pages
        });
    }).catch(next);
})

router.get('/published-news/detail/:id', (req, res, next) => {

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

                            return res.render('management/admin/vWPosts/detail_published_news.hbs', {
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

router.get('/published-news/detail/set-premium-true/:id', (req, res, next) => {
    var postID = req.params.id;
    var entity = {
        id: postID,
        type_post: 1 // type_post: 1 là premium
    }

    post_model.update(entity).then(n => {
        res.redirect('/admin/published-news/detail/' + postID);
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    })
        .catch(next);
})

router.get('/published-news/detail/set-premium-false/:id', (req, res, next) => {
    var postID = req.params.id;
    var entity = {
        id: postID,
        type_post: 0 // type_post: 0 là bình thường
    }

    post_model.update(entity).then(n => {
        res.redirect('/admin/published-news/detail/' + postID);
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    })
        .catch(next);
})

router.get('/published-news/detail/delete/:id', (req, res) => {
    var postID = req.params.id;
    var entity = {
        id: postID,
        is_deleted: 1
    }

    post_model.update(entity).then(n => {
        res.redirect('/admin/published-news');
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    });
})

//#endregion

//------------------------ Bài viết bị từ chối ----------------------------------------
//#region
router.get('/denied-news', (req, res, next) => {
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

router.get('/denied-news/detail/:id', (req, res, next) => {

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

router.get('/denied-news/detail/set-premium-true/:id', (req, res, next) => {
    var postID = req.params.id;
    var entity = {
        id: postID,
        type_post: 1 // type_post: 1 là premium
    }

    post_model.update(entity).then(n => {
        res.redirect('/admin/denied-news/detail/' + postID);
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    })
        .catch(next);
})

router.get('/denied-news/detail/set-premium-false/:id', (req, res, next) => {
    var postID = req.params.id;
    var entity = {
        id: postID,
        type_post: 0 // type_post: 0 là bình thường
    }

    post_model.update(entity).then(n => {
        res.redirect('/admin/denied-news/detail/' + postID);
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    })
        .catch(next);
})

router.post('/denied-news/detail/accept/:id', (req, res, next) => {
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
                                res.redirect('/admin/denied-news');
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

//#endregion


//------------------------ Phóng viên ----------------------------------------
//#region
router.get('/writer', (req, res, next) => {
    var page = req.query.page || 1;
    if (page < 1) page = 1;

    var limit = 10;
    var offset = (page - 1) * limit;


    Promise.all([
        user_model.pageWriter(limit, offset),
        user_model.countOfType('WRITER')
    ]).then(([rows, count_rows]) => {
        //Format ngay sinh
        for (i = 0; i < rows.length; i++) {
            rows[i].dob = my_utils.toDateString(rows[i].dob);
        }

        var total = count_rows[0].total;
        var nPages = Math.floor(total / limit);
        if (total % limit > 0) nPages++;
        var pages = [];
        for (i = 1; i <= nPages; i++) {
            var obj = { value: i, active: i === +page };
            pages.push(obj);
        }

        res.render('management/admin/vWUsers/writer.hbs', {
            writers: rows,
            pages
        });
    }).catch(next);
})

router.get('/writer/is-available', (req, res) => {
    var email = req.query.email;

    user_model.singleByEmail(email).then(rows => {
        if (rows.length > 0) {
            return res.json(false);
        }
        return res.json(true);
    })
})

router.post('/writer/register', (req, res, next) => {
    const saltRounds = 10;

    var name = req.body.name;
    var dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var email = req.body.email;
    var pseudonym = req.body.pseudonym;
    var pwHash = bcrypt.hashSync(req.body.password, 10);
    // ngày hết hạn là 7 ngày sau khi đăng ký
    var user = {
        name: name,
        dob: dob,
        email: email,
        password: pwHash,
        pseudonym: pseudonym
    };

    user_model.addNewUser(user)
        .then(userID => {

            account_type.accountTypeByType('WRITER')
                .then(rows => {
                    if (rows.length === 0) {
                        throw new Event('Not exists user type!');
                    } else {
                        var userAccountType = {
                            id_user: userID,
                            id_account_type: rows[0].id
                        };

                        user_account_type.addNewUserAccountType(userAccountType)
                            .then(id => {
                                res.redirect('/admin/writer');
                            })
                            .catch(next);
                    }
                })
                .catch(next);
        })
        .catch(next);
})

router.get('/writer/ban/:id', (req, res) => {
    var userID = req.params.id;
    var entity = {
        id: userID,
        is_deleted: 1
    }

    user_model.update(entity).then(n => {
        //res.redirect('/admin/categories');
        res.redirect('/admin/writer');
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    });
})

//#endregion
//------------------------ Biên tập viên ----------------------------------------
//#region
router.get('/editor', (req, res, next) => {
    var page = req.query.page || 1;
    if (page < 1) page = 1;

    var limit = 10;
    var offset = (page - 1) * limit;


    Promise.all([
        user_model.pageEditor(limit, offset),
        user_model.countOfType("EDITOR"),
        categoryModel.rootCat(),
        categoryModel.exceptRootCat()
    ]).then(([rows, count_rows, rootCat, childCat]) => {
        var editors = [];
        for (i = 0; i < rows.length; i++) {
            Promise.all([user_cat.getCatManagenment(rows[i].id), i])
                .then(([values, pos]) => {
                    var strCatManagement = ""
                    if (values.length > 0) {
                        strCatManagement = values[0].cat_name;
                    }

                    if (values.length > 1) {
                        strCatManagement += " ...";
                    }

                    var catManagementHTML = "";
                    // chuỗi có dạng "id1 id2 id3 "
                    var strCatID = "";
                    for (i = 0; i < values.length; i++) {
                        strCatID += values[i].id.toString() + " ";
                        catManagementHTML += '<li>' + values[i].cat_name + '</li>';
                    }

                    var obj = {
                        id: rows[pos].id,
                        name: rows[pos].name,
                        dob: my_utils.toDateString(rows[pos].dob),
                        email: rows[pos].email,
                        catManagement: values,
                        strCatManagement: strCatManagement,
                        strCatID: strCatID,
                        catManagementHTML: catManagementHTML
                    };
                    editors.push(obj);
                }).catch(next);
        }

        var total = count_rows[0].total;
        var nPages = Math.floor(total / limit);
        if (total % limit > 0) nPages++;
        var pages = [];
        for (i = 1; i <= nPages; i++) {
            var obj = { value: i, active: i === +page };
            pages.push(obj);
        }

        //Phân level chuyên mục
        var rootCategories = [];
        for (i = 0; i < rootCat.length; i++) {
            var childCategories = [];
            for (j = 0; j < childCat.length; j++) {
                if (rootCat[i].id === childCat[j].parent_cat) {
                    childCategories.push(childCat[j]);
                }
            }
            var obj = {
                id: rootCat[i].id,
                cat_name: rootCat[i].cat_name,
                childCategories: childCategories
            };
            rootCategories.push(obj);
        }

        res.render('management/admin/vWUsers/editor.hbs', {
            editors,
            pages,
            rootCategories
        });
    }).catch(next);
})

router.get('/editor/is-available', (req, res) => {
    var email = req.query.email;

    user_model.singleByEmail(email).then(rows => {
        if (rows.length > 0) {
            return res.json(false);
        }
        return res.json(true);
    })
})

router.post('/editor/register', (req, res, next) => {
    const saltRounds = 10;

    var name = req.body.name;
    var dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var email = req.body.email;
    var pwHash = bcrypt.hashSync(req.body.password, 10);
    var catManagement = req.body.catManagement;
    console.log(catManagement[0]);
    var user = {
        name: name,
        dob: dob,
        email: email,
        password: pwHash
    };

    user_model.addNewUser(user)
        .then(userID => {

            account_type.accountTypeByType('EDITOR')
                .then(rows => {
                    if (rows.length === 0) {
                        throw new Event('Not exists user type!');
                    } else {
                        var userAccountType = {
                            id_user: userID,
                            id_account_type: rows[0].id
                        };

                        user_account_type.addNewUserAccountType(userAccountType)
                            .then(id => {
                                //phân công chuyên mục cho editor 
                                //dễ gặp bug đa luồng
                                var pos = 0;
                                for (i = 0; i < catManagement.length; i++) {
                                    var obj = {
                                        id_user: userID,
                                        id_category: catManagement[i]
                                    };
                                    pos++;
                                    if (pos === catManagement.length) {
                                        user_cat.add(obj)
                                            .then(id => {
                                                res.redirect('/admin/editor');
                                            })
                                            .catch(next);
                                    }
                                    else {
                                        user_cat.add(obj)
                                            .then(id => {
                                            })
                                            .catch(next);
                                    }
                                }

                            })
                            .catch(next);
                    }
                })
                .catch(next);
        })
        .catch(next);
})

router.post('/editor/assign/:id', (req, res, next) => {
    var userID = req.params.id;
    var catManagement = req.body.catManagement;
    user_cat.deleteByID(userID)
        .then(value => {
            //phân công chuyên mục cho editor 
            //dễ gặp bug đa luồng
            var pos = 0;
            for (i = 0; i < catManagement.length; i++) {
                var obj = {
                    id_user: userID,
                    id_category: catManagement[i]
                };
                pos++;
                if (pos === catManagement.length) {
                    user_cat.add(obj)
                        .then(id => {
                            res.redirect('/admin/editor');
                        })
                        .catch(next);
                }
                else {
                    user_cat.add(obj)
                        .then(id => {
                        })
                        .catch(next);
                }
            }
        }).catch(next);
})

router.get('/editor/ban/:id', (req, res) => {
    var userID = req.params.id;
    var entity = {
        id: userID,
        is_deleted: 1
    }

    user_model.update(entity).then(n => {
        //res.redirect('/admin/categories');
        res.redirect('/admin/editor');
    }).catch(err => {
        console.log(err);
        res.end('error occured.')
    });
})

//#endregion
//------------------------ Độc giả ----------------------------------------
//#region
router.get('/subscriber', (req, res, next) => {
    var page = req.query.page || 1;
    if (page < 1) page = 1;

    var limit = 10;
    var offset = (page - 1) * limit;


    Promise.all([
        user_model.pageSubscriber(limit, offset),
        user_model.countOfType("SUBSCRIBER")
    ]).then(([rows, count_rows]) => {
        //Sua ngay het han va ngay sinh
        var subscribers = [];
        var current = new Date();
        for (i = 0; i < rows.length; i++) {
            var obj = {
                id: rows[i].id,
                name: rows[i].name,
                dob: my_utils.toDateString(rows[i].dob),
                email: rows[i].email,
                exp_date: rows[i].exp_date === null ? "" : my_utils.toDateString(rows[i].exp_date),
                status: '<span class="badge badge-success">Premium</span>'
            };
            if (obj.exp_date === "") {
                obj.status = '<span class="badge badge-warning">Hết hạn</span>';
            }
            else if (moment(current).format('YYYY/MM/DD') > moment(rows[i].exp_date).format('YYYY/MM/DD')) {
                obj.status = '<span class="badge badge-warning">Hết hạn</span>';
            }
            subscribers.push(obj);
        }

        var total = count_rows[0].total;
        var nPages = Math.floor(total / limit);
        if (total % limit > 0) nPages++;
        var pages = [];
        for (i = 1; i <= nPages; i++) {
            var obj = { value: i, active: i === +page };
            pages.push(obj);
        }

        res.render('management/admin/vWUsers/subscriber.hbs', {
            subscribers,
            pages
        });
    }).catch(next);
})

router.get('/subscriber/is-available', (req, res) => {
    var email = req.query.email;

    user_model.singleByEmail(email).then(rows => {
        if (rows.length > 0) {
            return res.json(false);
        }
        return res.json(true);
    })
})

router.post('/subscriber/register', (req, res, next) => {
    const saltRounds = 10;

    var name = req.body.name;
    var dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var email = req.body.email;
    var pwHash = bcrypt.hashSync(req.body.password, 10);
    // ngày hết hạn là 7 ngày sau khi đăng ký
    var date = new Date();
    date = new Date(date.getTime() + (7 * 24 * 60 * 60 * 1000));
    var exp_date = moment(date).format('YYYY-MM-DD');
    var user = {
        name: name,
        dob: dob,
        email: email,
        password: pwHash,
        exp_date: exp_date
    };

    user_model.addNewUser(user)
        .then(userID => {

            account_type.accountTypeByType('SUBSCRIBER')
                .then(rows => {
                    if (rows.length === 0) {
                        throw new Event('Not exists user type!');
                    } else {
                        var userAccountType = {
                            id_user: userID,
                            id_account_type: rows[0].id
                        };

                        user_account_type.addNewUserAccountType(userAccountType)
                            .then(id => {
                                res.redirect('/admin/subscriber');
                            })
                            .catch(next);
                    }
                })
                .catch(next);
        })
        .catch(next);
})

router.post('/subscriber/renew/:id', (req, res) => {
    var userID = req.params.id;
    var nDayRenew = req.body.nDayRenew;
    //lấy ngày hết hạn
    user_model.getExpDate(userID)
        .then(value => {
            var current = new Date();
            var newDate = new Date();
            //nếu ngày hết hạn bé hơn ngày hiện tại thì lấy ngày hiện tại cộng lên
            if(moment(current).format('YYYY/MM/DD') > moment(value[0].exp_date).format('YYYY/MM/DD'))
            {
                newDate = new Date(current.getTime() + (nDayRenew * 24 * 60 * 60 * 1000));
            }
            else{
                var date = new Date(value[0].exp_date);
                newDate = new Date(date.getTime() + (nDayRenew * 24 * 60 * 60 * 1000));
            }

            var entity = {
                id: userID,
                exp_date: moment(newDate).format('YYYY-MM-DD')
            }
        
            user_model.update(entity).then(n => {
                //res.redirect('/admin/categories');
                res.redirect('/admin/subscriber');
            }).catch(err => {
                console.log(err);
                res.end('error occured.')
            });
        })
        .catch(err => {
            console.log(err);
            res.end('error occured.')
        });
})

router.get('/subscriber/ban/:id', (req, res) => {
    var userID = req.params.id;
    var entity = {
      id: userID,
      is_deleted: 1
    }
  
    user_model.update(entity).then(n => {
      //res.redirect('/admin/categories');
      res.redirect('/admin/subscriber');
    }).catch(err => {
      console.log(err);
      res.end('error occured.')
    });
  })


//#endregion



module.exports = router;