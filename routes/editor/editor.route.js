var exp = require('express');
var drafpostModel = require('../../models/drafpost.model');

var router = exp.Router();

router.get('/', (req, res) => {
  res.locals.pageTitle = 'Kiểm duyệt bài viết';
  drafpostModel.byCat(9)
      .then(rows => {
        
        res.render('management/editor/editor.view.hbs', {
          drafposts: rows
        });
      }).catch(err => {
        console.log(err);
        res.end('error occured.')
    });
})

module.exports = router;