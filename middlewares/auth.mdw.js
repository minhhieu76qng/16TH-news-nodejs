module.exports = (req, res, next) => {
    console.log(req.user);

    if (!req.user) {
        req.flash('msg_type', 'warning');
        req.flash('msg', 'Bạn cần đăng nhập để xem thông tin cá nhân.');
        res.redirect(`/account/login?retUrl=${req.originalUrl}`);
    } else {
        next();
    }
}
