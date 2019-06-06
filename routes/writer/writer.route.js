var exp = require('express');

var router = exp.Router();


router.get('/', (req, res) => {
    res.render('management/writer/writer.view.hbs');
})


module.exports = router;