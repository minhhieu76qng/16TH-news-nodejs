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



//----------------------- Bài viết chưa duyệt ------------------------------------
//#region
router.get('/', (req, res, next) => {
  res.locals.pageTitle = "EDITOR:Bài viết chưa duyệt";
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

      if (users[0].type !== 'EDITOR') {
        return res.render('notify', {
          msg_title: 'Không thể truy cập trang này.',
          msg_detail: 'Tài khoản của bạn không có quyền truy cập trang này.'
        })
      }

      var page = req.query.page || 1;
      if (page < 1) page = 1;

      var limit = 10;
      var offset = (page - 1) * limit;

      // 
      Promise.all([
        post_model.getListNotAcceptedEditor(UserID, 4, limit, offset),//4: trạng thái chưa duyệt
        post_model.countListNotAcceptedEditor(UserID, 4),
      ]).then(([rows, count_rows]) => {
        var total = count_rows[0].total;
        var nPages = Math.floor(total / limit);
        if (total % limit > 0) nPages++;
        var pages = [];
        for (i = 1; i <= nPages; i++) {
          var obj = { value: i, active: i === +page };
          pages.push(obj);
        }

        res.render('management/editor/not_accepted_news.hbs', {
          posts: rows,
          pages
        });
      }).catch(next);
    })
    .catch(next);

})

router.get('/detail/:id', (req, res, next) => {
  res.locals.pageTitle = "EDITOR:Chi tiết bài viết";
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

      if (users[0].type !== 'EDITOR') {
        return res.render('notify', {
          msg_title: 'Không thể truy cập trang này.',
          msg_detail: 'Tài khoản của bạn không có quyền truy cập trang này.'
        })
      }

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
            user_cat.getCatManagenment(UserID),
            tag_model.getList(100, 0) //limit: 100 offset: 0
          ])
          .then(([detail, rowsCat, tagRows]) => {
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

                  //chuyên mục sẽ chứa id, tên, và biến selected có phải là chuyên mục của bài viết hay không
                  var Categories = [];

                  for (j = 0; j < rowsCat.length; j++) {
                    var obj = {
                      id: rowsCat[j].id,
                      cat_name: rowsCat[j].cat_name,
                      selected: post.id_category === rowsCat[j].id
                    };
                    Categories.push(obj);
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

                  return res.render('management/editor/detail_not_accepted_news.hbs', {
                    post: post,
                    tags: tags,
                    msgToView: {
                      msg_type: msg_type,
                      msg: msg
                    },
                    is_premium: post.type_post === 1,
                    Categories,
                    listTags
                  });
                })
                .catch(next)
            }
          })
          .catch(next);
      }
    })
    .catch(next);


})

router.get('/detail/set-premium-true/:id', (req, res, next) => {

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

      if (users[0].type !== 'EDITOR') {
        return res.render('notify', {
          msg_title: 'Không thể truy cập trang này.',
          msg_detail: 'Tài khoản của bạn không có quyền truy cập trang này.'
        })
      }

      var postID = req.params.id;
      var entity = {
        id: postID,
        type_post: 1 // type_post: 1 là premium
      }

      post_model.update(entity).then(n => {
        res.redirect('/editor/detail/' + postID);
      }).catch(err => {
        console.log(err);
        res.end('error occured.')
      })
    })
    .catch(next);

})

router.get('/detail/set-premium-false/:id', (req, res, next) => {
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

      if (users[0].type !== 'EDITOR') {
        return res.render('notify', {
          msg_title: 'Không thể truy cập trang này.',
          msg_detail: 'Tài khoản của bạn không có quyền truy cập trang này.'
        })
      }

      var postID = req.params.id;
      var entity = {
        id: postID,
        type_post: 0 // type_post: 0 là bình thường
      }

      post_model.update(entity).then(n => {
        res.redirect('/editor/detail/' + postID);
      }).catch(err => {
        console.log(err);
        res.end('error occured.')
      })
    })
    .catch(next);

})

router.post('/detail/accept/:id', (req, res, next) => {
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

      if (users[0].type !== 'EDITOR') {
        return res.render('notify', {
          msg_title: 'Không thể truy cập trang này.',
          msg_detail: 'Tài khoản của bạn không có quyền truy cập trang này.'
        })
      }

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
        id_user: UserID,                                       //--------lấy user id sau khi đăng nhập-------
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

            let arrObj = [];

            for (i = 0; i < post_tags.length; i++) {
              var obj = {
                id_post: post_id,
                id_tag: post_tags[i]
              };
              arrObj.push(obj);
            }

            Promise.all(
              arrObj.map(val => post_tagModel.add(val))
            )
              .then(rows => {
                return res.redirect('/editor/detail/' + post_id);
              })
              .catch(next)
          }).catch(next);
      }).catch(next);
    })
    .catch(next);
})

router.post('/detail/deny/:id', (req, res, next) => {
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

      if (users[0].type !== 'EDITOR') {
        return res.render('notify', {
          msg_title: 'Không thể truy cập trang này.',
          msg_detail: 'Tài khoản của bạn không có quyền truy cập trang này.'
        })
      }
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
        id_user: UserID, //lấy user id sau khi đăng nhập
        date_modified: moment(current).format('YYYY-MM-DD HH:mm'),
        note: reason_deny
      }
      //thêm promise add cái post_action
      Promise.all([
        post_model.update(entity),
        post_actionModel.add(post_action)
      ]).then(([value1, value2]) => {
        res.redirect('/editor');
      }).catch(next);

    })
    .catch(next);

})

//#endregion


//------------------------ Bài viết chờ xuất bản ----------------------------------------
//#region
router.get('/accepted-news', (req, res, next) => {

  res.locals.pageTitle = "EDITOR:Bài viết chờ xuất bản";
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

      if (users[0].type !== 'EDITOR') {
        return res.render('notify', {
          msg_title: 'Không thể truy cập trang này.',
          msg_detail: 'Tài khoản của bạn không có quyền truy cập trang này.'
        })
      }
      var page = req.query.page || 1;
      if (page < 1) page = 1;

      var limit = 10;
      var offset = (page - 1) * limit;

      //lấy ngày hiện tại
      //trạng thái đã duyệt đang chờ xuất bản, xét currentDate > date_posted
      var current = new Date();
      var currentDate = moment(current).format('YYYY-MM-DD HH:mm');
      Promise.all([
        post_model.getAcceptPostEditor(UserID,currentDate, limit, offset),
        post_model.countAcceptPostEditor(UserID,currentDate),
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
        res.render('management/editor/accepted_news.hbs', {
          posts: rows,
          pages
        });
      }).catch(next);

    })
    .catch(next);

})

router.get('/accepted-news/detail/:id', (req, res, next) => {
  res.locals.pageTitle = "EDITOR:Chi tiết bài viết";
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

      if (users[0].type !== 'EDITOR') {
        return res.render('notify', {
          msg_title: 'Không thể truy cập trang này.',
          msg_detail: 'Tài khoản của bạn không có quyền truy cập trang này.'
        })
      }
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

                  return res.render('management/editor/detail_accepted_news.hbs', {
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
    .catch(next);

})

router.get('/accepted-news/detail/set-premium-true/:id', (req, res, next) => {
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

      if (users[0].type !== 'EDITOR') {
        return res.render('notify', {
          msg_title: 'Không thể truy cập trang này.',
          msg_detail: 'Tài khoản của bạn không có quyền truy cập trang này.'
        })
      }
      var postID = req.params.id;
      var entity = {
        id: postID,
        type_post: 1 // type_post: 1 là premium
      }

      post_model.update(entity).then(n => {
        res.redirect('/editor/accepted-news/detail/' + postID);
      }).catch(err => {
        console.log(err);
        res.end('error occured.')
      })

    })
    .catch(next);

})

router.get('/accepted-news/detail/set-premium-false/:id', (req, res, next) => {
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

      if (users[0].type !== 'EDITOR') {
        return res.render('notify', {
          msg_title: 'Không thể truy cập trang này.',
          msg_detail: 'Tài khoản của bạn không có quyền truy cập trang này.'
        })
      }
      var postID = req.params.id;
      var entity = {
        id: postID,
        type_post: 0 // type_post: 0 là bình thường
      }

      post_model.update(entity).then(n => {
        res.redirect('/editor/accepted-news/detail/' + postID);
      }).catch(err => {
        console.log(err);
        res.end('error occured.')
      })

    })
    .catch(next);

})

router.get('/accepted-news/detail/delete/:id', (req, res, next) => {
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

      if (users[0].type !== 'EDITOR') {
        return res.render('notify', {
          msg_title: 'Không thể truy cập trang này.',
          msg_detail: 'Tài khoản của bạn không có quyền truy cập trang này.'
        })
      }
      var postID = req.params.id;
      var entity = {
        id: postID,
        is_deleted: 1
      }

      post_model.update(entity).then(n => {
        res.redirect('/editor/accepted-news');
      }).catch(err => {
        console.log(err);
        res.end('error occured.')
      });

    })
    .catch(next);

})

//#endregion

//------------------------ Bài viết đã xuất bản ----------------------------------------
//#region
router.get('/published-news', (req, res, next) => {
  res.locals.pageTitle = "EDITOR:Bài viết đã xuất bản";
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

      if (users[0].type !== 'EDITOR') {
        return res.render('notify', {
          msg_title: 'Không thể truy cập trang này.',
          msg_detail: 'Tài khoản của bạn không có quyền truy cập trang này.'
        })
      }
      var page = req.query.page || 1;
      if (page < 1) page = 1;

      var limit = 10;
      var offset = (page - 1) * limit;
      var current = new Date();
      var currentDate = moment(current).format('YYYY-MM-DD HH:mm');

      Promise.all([
        post_model.getPublishedPostEditor(UserID,currentDate, limit, offset),//2: trạng thái đã xuất bản
        post_model.countPublishedPostEditor(UserID,currentDate),
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
        res.render('management/editor/published_news.hbs', {
          posts: rows,
          pages
        });
      }).catch(next);

    })
    .catch(next);

})

router.get('/published-news/detail/:id', (req, res, next) => {
  res.locals.pageTitle = "EDITOR:Chi tiết bài viết";
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

      if (users[0].type !== 'EDITOR') {
        return res.render('notify', {
          msg_title: 'Không thể truy cập trang này.',
          msg_detail: 'Tài khoản của bạn không có quyền truy cập trang này.'
        })
      }
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

                  return res.render('management/editor/detail_published_news.hbs', {
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
    .catch(next);

})

router.get('/published-news/detail/set-premium-true/:id', (req, res, next) => {
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

      if (users[0].type !== 'EDIOTR') {
        return res.render('notify', {
          msg_title: 'Không thể truy cập trang này.',
          msg_detail: 'Tài khoản của bạn không có quyền truy cập trang này.'
        })
      }
      var postID = req.params.id;
      var entity = {
        id: postID,
        type_post: 1 // type_post: 1 là premium
      }

      post_model.update(entity).then(n => {
        res.redirect('/editor/published-news/detail/' + postID);
      }).catch(err => {
        console.log(err);
        res.end('error occured.')
      })

    })
    .catch(next);
})

router.get('/published-news/detail/set-premium-false/:id', (req, res, next) => {
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

      if (users[0].type !== 'EDITOR') {
        return res.render('notify', {
          msg_title: 'Không thể truy cập trang này.',
          msg_detail: 'Tài khoản của bạn không có quyền truy cập trang này.'
        })
      }
      var postID = req.params.id;
      var entity = {
        id: postID,
        type_post: 0 // type_post: 0 là bình thường
      }

      post_model.update(entity).then(n => {
        res.redirect('/editor/published-news/detail/' + postID);
      }).catch(err => {
        console.log(err);
        res.end('error occured.')
      })

    })
    .catch(next);

})

router.get('/published-news/detail/delete/:id', (req, res, next) => {
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

      if (users[0].type !== 'EDITOR') {
        return res.render('notify', {
          msg_title: 'Không thể truy cập trang này.',
          msg_detail: 'Tài khoản của bạn không có quyền truy cập trang này.'
        })
      }
      var postID = req.params.id;
      var entity = {
        id: postID,
        is_deleted: 1
      }

      post_model.update(entity).then(n => {
        res.redirect('/editor/published-news');
      }).catch(err => {
        console.log(err);
        res.end('error occured.')
      });

    })
    .catch(next);

})

//#endregion

//------------------------ Bài viết bị từ chối ----------------------------------------
//#region
router.get('/denied-news', (req, res, next) => {
  res.locals.pageTitle = "EDITOR:Bài viết bị từ chối";
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

      if (users[0].type !== 'EDITOR') {
        return res.render('notify', {
          msg_title: 'Không thể truy cập trang này.',
          msg_detail: 'Tài khoản của bạn không có quyền truy cập trang này.'
        })
      }
      var page = req.query.page || 1;
      if (page < 1) page = 1;

      var limit = 10;
      var offset = (page - 1) * limit;


      Promise.all([
        post_model.getListDeniedEditor(UserID, 3, limit, offset),//3: trạng thái bị từ chối
        post_model.countListDeniedEditor(UserID, 3),
      ]).then(([rows, count_rows]) => {
        var total = count_rows[0].total;
        var nPages = Math.floor(total / limit);
        if (total % limit > 0) nPages++;
        var pages = [];
        for (i = 1; i <= nPages; i++) {
          var obj = { value: i, active: i === +page };
          pages.push(obj);
        }

        res.render('management/editor/denied_news.hbs', {
          posts: rows,
          pages
        });
      }).catch(next);

    })
    .catch(next);

})

router.get('/denied-news/detail/:id', (req, res, next) => {
  res.locals.pageTitle = "EDITOR:Chi tiết bài viết";
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

      if (users[0].type !== 'EDITOR') {
        return res.render('notify', {
          msg_title: 'Không thể truy cập trang này.',
          msg_detail: 'Tài khoản của bạn không có quyền truy cập trang này.'
        })
      }
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
            user_cat.getCatManagenment(UserID),
            tag_model.getList(100, 0), //limit: 100 offset: 0
            post_actionModel.byPostID(post_id)
          ])
          .then(([detail, rowsCat, tagRows, post_action]) => {
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
                  //chuyên mục sẽ chứa id, tên, và biến selected có phải là chuyên mục của bài viết hay không
                  var Categories = [];

                  for (j = 0; j < rowsCat.length; j++) {
                    var obj = {
                      id: rowsCat[j].id,
                      cat_name: rowsCat[j].cat_name,
                      selected: post.id_category === rowsCat[j].id
                    };
                    Categories.push(obj);
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

                  return res.render('management/editor/detail_denied_news.hbs', {
                    post: post,
                    tags: tags,
                    msgToView: {
                      msg_type: msg_type,
                      msg: msg
                    },
                    is_premium: post.type_post === 1,
                    Categories,
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
    .catch(next);

})

router.get('/denied-news/detail/set-premium-true/:id', (req, res, next) => {
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

      if (users[0].type !== 'EDITOR') {
        return res.render('notify', {
          msg_title: 'Không thể truy cập trang này.',
          msg_detail: 'Tài khoản của bạn không có quyền truy cập trang này.'
        })
      }
      var postID = req.params.id;
      var entity = {
        id: postID,
        type_post: 1 // type_post: 1 là premium
      }

      post_model.update(entity).then(n => {
        res.redirect('/editor/denied-news/detail/' + postID);
      }).catch(err => {
        console.log(err);
        res.end('error occured.')
      })

    })
    .catch(next);

})

router.get('/denied-news/detail/set-premium-false/:id', (req, res, next) => {
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

      if (users[0].type !== 'EDITOR') {
        return res.render('notify', {
          msg_title: 'Không thể truy cập trang này.',
          msg_detail: 'Tài khoản của bạn không có quyền truy cập trang này.'
        })
      }
      var postID = req.params.id;
      var entity = {
        id: postID,
        type_post: 0 // type_post: 0 là bình thường
      }

      post_model.update(entity).then(n => {
        res.redirect('/editor/denied-news/detail/' + postID);
      }).catch(err => {
        console.log(err);
        res.end('error occured.')
      })
        .catch(next);

    })
    .catch(next);

})

router.post('/denied-news/detail/accept/:id', (req, res, next) => {
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

      if (users[0].type !== 'EDITOR') {
        return res.render('notify', {
          msg_title: 'Không thể truy cập trang này.',
          msg_detail: 'Tài khoản của bạn không có quyền truy cập trang này.'
        })
      }
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
        id_user: UserID, //lấy user id sau khi đăng nhập
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

            let arrObj = [];
            for (i = 0; i < post_tags.length; i++) {
              var obj = {
                id_post: post_id,
                id_tag: post_tags[i]
              };
              arrObj.push(obj);
            }

            Promise.all(
              arrObj.map(val => post_tagModel.add(val))
            )
              .then(rows => {
                return res.redirect('/editor/denied-news');
              })
              .catch(next)
          }).catch(next);
      }).catch(next);

    })
    .catch(next);

})

//#endregion



module.exports = router;