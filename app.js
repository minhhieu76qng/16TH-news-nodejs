var express = require('express');
var exphbs = require('express-handlebars');
var hbs_sections = require('express-handlebars-sections');

var app = express();

app.engine("hbs", exphbs({
    defaultLayout : 'main.hbs',
    layoutsDir : 'views/_layouts',
    helpers : {
        section : hbs_sections()
    }
}));

app.set('view engine', 'hbs');

app.use('/asset', express.static('public'));


app.use('/', require('./routes/news/index.route'));
app.use('/writer', require('./routes/writer/writer.route.js'));

app.listen(3000, () => {
    console.log('App is running at https://localhost:3000');
})