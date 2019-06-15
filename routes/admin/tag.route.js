var exp = require('express');
var tagModel = require('../../models/tag.model');

var router = exp.Router();



router.get('/', (req, res, next) => {
  var page = req.query.page || 1;
  if (page < 1) page = 1;

  var limit = 10;
  var offset = (page - 1) * limit;


  Promise.all([
    tagModel.pageTag(limit, offset),
    tagModel.count(),
  ]).then(([rows, count_rows]) => {
    var total = count_rows[0].total;
    var nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;
    var pages = [];
    for (i = 1; i <= nPages; i++) {
      var obj = { value: i, active: i === +page };
      pages.push(obj);
    }

    res.render('management/admin/vWTags/tags.hbs', {
      tags: rows,
      pages
    });
  }).catch(next);
})

router.get('/is-available', (req, res, next) => {
  var tag_name = req.query.tag_name;
  var id = req.query.id;
  
  Promise.all(
  [tagModel.singleByTagName(tag_name, id)]).then(([rows]) => {
    if (rows.length > 0) {
      return res.json(false);
    }
    return res.json(true);
  }).catch(next);
})

router.post('/add', (req, res) => {
    tagModel.add(req.body).then(id => {
    res.redirect('/admin');
  }).catch(err => {
    console.log(err);
    res.end('error occured.')
  });
})

router.post('/update', (req, res) => {
    tagModel.update(req.body).then(n => {
    res.redirect('/admin');
  }).catch(err => {
    console.log(err);
    res.end('error occured.')
  });
})

router.get('/delete/:id', (req, res) => {
  var tagID = req.params.id;
  var entity = {
    id: tagID,
    is_deleted: 1
  }

  tagModel.update(entity).then(n => {
    res.redirect('/admin');
  }).catch(err => {
    console.log(err);
    res.end('error occured.')
  });
})

module.exports = router;