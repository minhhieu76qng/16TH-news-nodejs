var express = require('express');
var morgan = require('morgan');
var flash = require('connect-flash');

var app = express();

var auth = require('./middlewares/auth.mdw');

// morgan log
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(flash());

app.use('/asset', express.static('public'));

require('./middlewares/view-engine.mdw')(app);
require('./middlewares/session')(app);
require('./middlewares/passport')(app);

// load danh muc
app.use(require('./middlewares/auth-local.mdw'));
app.use(require('./middlewares/locals.mdw'));

app.use('/account', require('./routes/account/account.route'));

app.use('/categories', require('./routes/news/categories.route'));
app.use('/posts', require('./routes/news/posts.route'));
app.use('/tags', require('./routes/news/tags.route'));
app.use('/search', require('./routes/news/search.route'));
app.use('/', require('./routes/news/index.route'));

app.use('/dashboard', auth, require('./routes/dashboard/dashboard.route'));

app.use('/writer', auth , require('./routes/writer/writer.route.js'));
app.use('/admin', auth , require('./routes/admin/admin.route'));
app.use('/editor', auth, require('./routes/editor/editor.route'));

app.use((req, res, next) => {
    res.render('404', {
        layout: false
    });
})

app.use((error, req, res, next) => {
    res.render('error.hbs', {
        layout: false,
        message: error.message,
        error
    })
})

app.listen(3000, () => {
    console.log('App is running at http://localhost:3000');
})