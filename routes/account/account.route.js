var express = require('express');

var bcrypt = require('bcrypt');
var moment = require('moment');

var user_model = require('../../models/user.model');
var account_type = require('../../models/user_type');
var user_account_type = require('../../models/user_account_type.model');

var router = express.Router();

router.get('/login', (req, res, next) => {
    res.locals.pageTitle = "Đăng nhập";
    res.render('account/login');
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
})

router.post('/register', (req, res, next) => {
    const saltRounds = 10;
    
    var name = req.body.name;
    var dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var email = req.body.email;
    var pwHash = bcrypt.hashSync(req.body.password, 10);

    var user = {
        name : name,
        dob : dob,
        email : email,
        password : pwHash
    };

    user_model.addNewUser(user)
        .then(userID => {

            account_type.accountTypeByType('NORMAL')
                .then(rows => {
                    if (rows.length === 0){
                        throw new Event('Not exists user type!');
                    } else {
                        var userAccountType = {
                            id_user : userID,
                            id_account_type : rows[0].id
                        };

                        user_account_type.addNewUserAccountType(userAccountType)
                            .then(id => {
                                res.redirect('/');
                            })
                            .catch(next);
                    }                    
                })
                .catch(next);
        })
        .catch(next);
})

router.post('/forgot-password', (req, res, next) => {
})

router.post('/is-available', (req, res) => {
    var email = req.body.email;

    user_model.singleByEmail(email).then(rows => {
        if (rows.length > 0){
            return res.json(false);
        }
        return res.json(true);
    })
})

module.exports = router;
