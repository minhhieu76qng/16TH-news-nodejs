var express = require('express');
var exphbs = require('express-handlebars');
var hbs_sections = require('express-handlebars-sections');

var morgan = require('morgan');

var app = express();



app.engine("hbs", exphbs({
    defaultLayout: 'main.hbs',
    layoutsDir: 'views/_layouts',
    helpers: {
        section: hbs_sections()
    }
}));
app.set('view engine', 'hbs');

app.use('/asset', express.static('public'));

// morgan log
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded());

// load danh muc
app.use(require('./middlewares/locals.mdw'));


app.use('/', require('./routes/news/index.route'));
// app.use('/writer', require('./routes/writer/writer.route.js'));
//app.use('/admin', require('./routes/admin/category.route.js'));
app.use('/admin', require('./routes/admin/category.route.js'));

// app.get('/', (req, res) => {
//     console.log(res.locals.currentTime);
//     res.render('news/index');
// })

app.use((req, res, next) => {
    res.render('404', {
        layout: false
    });
})

// app.use((error, req, res, next) => {
//     res.render('/views/error.hbs', {
//         layout: false,
//         message: error.message,
//         error
//     })
// })

app.listen(3000, () => {
    console.log('App is running at https://localhost:3000');
})