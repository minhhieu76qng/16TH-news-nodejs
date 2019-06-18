var express = require('express');
var router = express.Router();

var user_model = require('../../models/user.model');

router.get('/', (req, res, next) => {
    // redirect theo loại user
    const UserID = req.user.id;

    user_model.detailUserByID(UserID)
        .then(rows => {
            if (rows.length === 0) {
                return res.render('notify', {
                    msg_title: 'Không tồn tại người dùng.',
                    msg_detail: 'Tài khoản của bạn đã không còn tồn tại trong hệ thống.'
                })
            }

            const User = rows[0];

            if (User.type === 'WRITER') {
                return res.redirect('/writer');
            }
            if (User.type === 'EDITOR') {
                return res.redirect('/editor');
            }
            if (User.type === 'ADMIN') {
                return res.redirect('/admin');
            }

            return res.render('notify', {
                msg_title: 'Không được quyền truy cập.',
                msg_detail: 'Tài khoản của bạn không có quyền để truy cập trang này.'
            })
        })
        .catch(next)
})

module.exports = router;
