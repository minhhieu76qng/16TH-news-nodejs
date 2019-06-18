module.exports = (req, res, next) => {
    if (req.user){
        res.locals.isAuthenticated = true;
        res.locals.authUser = req.user;

        if (req.user.type === 'WRITER' || req.user.type === 'EDITOR' || req.user.type === 'ADMIN'){
            res.locals.isManager = true;
        } else {
            res.locals.isManager = false;
        }
    }
    next();
}