var session = require('express-session');
module.exports = function (app) {
    app.use(session({
        secret: 'iloveyousomuch',
        resave: true,
        saveUninitialized: true,
    }));
}