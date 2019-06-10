var exp = require('express');
var categoryModel = require('../../models/category.model');

var router = exp.Router();

// router.get('/', (req, res) => {
//     res.render('management/admin/vWCategories/categories.hbs');
// })

router.get('/', (req, res) => {
  categoryModel.getList()
    .then(rows => {
      res.render('management/admin/vWCategories/categories.hbs', {
        categories: rows
      });
    }).catch(err => {
      console.log(err);
      res.end('error occured.')
    });
})

router.post('/add', (req, res) => {
  categoryModel.add(req.body).then(id => {
    // console.log(id);
    //res.render('admin/vwCategories/add');
    res.redirect('/admin');
  }).catch(err => {
    console.log(err);
    res.end('error occured.')
  });
})

router.post('/update', (req, res) => {
  categoryModel.update(req.body).then(n => {
    //res.redirect('/admin/categories');
    res.redirect('/admin');
  }).catch(err => {
    console.log(err);
    res.end('error occured.')
  });
})

router.get('/delete/:id', (req, res) => {
  var id = req.params.id;
  categoryModel.delete(id).then(n => {
    //res.redirect('/admin/categories');
    res.redirect('/admin');
  }).catch(err => {
    console.log(err);
    res.end('error occured.')
  });
})

// router.get('/categories', (req, res) => {
//     res.render('management/admin/vWCategories/categories.hbs');
// })

module.exports = router;