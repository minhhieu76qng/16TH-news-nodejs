var express = require('express');

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
})

router.post('/forgot-password', (req, res, next) => {
})

module.exports = router;
