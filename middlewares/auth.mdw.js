module.exports = (req, res, next) => {
    if (!req.user) {
        if (req.originalUrl === '/account/logout')
            return next();
        req.flash('msg_type', 'warning');
        req.flash('msg', 'Bạn cần đăng nhập để sử dụng chức năng.');
        res.redirect(`/account/login?retUrl=${req.originalUrl}`);
    } else {
        next();
    }
}
