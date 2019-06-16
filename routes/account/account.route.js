var express = require('express');

var bcrypt = require('bcrypt');
var moment = require('moment');

var passport = require('passport');

var user_model = require('../../models/user.model');
var account_type = require('../../models/user_type.model');
var user_account_type = require('../../models/user_account_type.model');

var auth = require('../../middlewares/auth.mdw');

var router = express.Router();

router.get('/login', (req, res, next) => {
    res.locals.pageTitle = "Đăng nhập";
    // lấy thông báo
    const msg_type = req.flash('msg_type');
    const msg = req.flash('msg');

    return res.render('account/login', {
        hasRetUrl: req.query.retUrl ? true : false,
        retUrl: req.query.retUrl ? req.query.retUrl : '',
        message: {
            msg_type: msg_type,
            msg: msg
        }
    });
})

router.get('/register', (req, res, next) => {
    res.locals.pageTitle = "Đăng kí";
    res.render('account/register');
})

router.get('/forgot-password', (req, res, next) => {
    res.locals.pageTitle = "Quên mật khẩu";
    res.render('account/forgot_password');
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (error, user, info) => {
        if (error) {
            return next(error);
        }

        if (!user) {
            return res.render('account/login', {
                message: {
                    msg_type : 'warning',
                    msg : info.message
                }
            });
        }

        var retUrl = req.query.retUrl || '/';
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect(retUrl);
        })
    })(req, res, next);
})

router.post('/logout', auth, (req, res, next) => {
    req.logOut();
    res.redirect('/');
})

router.post('/register', (req, res, next) => {
    const saltRounds = 10;

    var name = req.body.name;
    var dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var email = req.body.email;
    var pwHash = bcrypt.hashSync(req.body.password, saltRounds);

    var user = {
        name: name,
        dob: dob,
        email: email,
        password: pwHash
    };

    user_model.addNewUser(user)
        .then(userID => {

            if (Number.isInteger(userID)) {
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
                                    // req.flash('msg_success', 'Đăng kí thành công. Bạn cần đăng nhập')
                                    req.flash('msg_type', 'success');
                                    req.flash('msg', 'Đăng kí thành công. Bạn cần đăng nhập.');
                                    res.redirect('/account/login');
                                })
                                .catch(next);
                        }
                    })
                    .catch(next);
            } else {
                req.flash('msg_type', 'danger');
                req.flash('msg', 'Đăng kí không thành công.');
                res.redirect('/account/register');
            }
        })
        .catch(next);
})

router.post('/forgot-password', (req, res, next) => {
})

router.post('/is-available', (req, res) => {
    var email = req.body.email;

    user_model.isExistsEmail(email).then(rows => {
        if (rows.length > 0) {
            return res.json(false);
        }
        return res.json(true);
    })
})

router.get('/profile', auth, (req, res, next) => {
    res.end('profile');
})

module.exports = router;
