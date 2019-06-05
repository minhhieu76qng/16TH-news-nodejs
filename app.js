var express = require('express');
var exphbs = require('express-handlebars');

var app = express();

app.engine("hbs", exphbs({
    defaultLayout : '_layouts/main.hbs',
    layoutsDir : 'views'
}));

app.set('view engine', 'hbs');

app.use('/asset', express.static('public'));


app.get('/', (req, res) => {
    res.locals.header = {
        title : "Hello"
    };
    res.render('body');
});

app.listen(3000, () => {
    console.log('App is running at https://localhost:3000');
})