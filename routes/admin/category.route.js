var exp = require('express');
var categoryModel = require('../../models/category.model');

var router = exp.Router();

// router.get('/', (req, res) => {
//     res.render('management/admin/vWCategories/categories.hbs');
// })



router.get('/', (req, res, next) => {
  var page = req.query.page || 1;
  if (page < 1) page = 1;

  var limit = 10;
  var offset = (page - 1) * limit;


  Promise.all([
    categoryModel.pageCat(limit, offset),
    categoryModel.count(),
    categoryModel.rootCat()
  ]).then(([rows, count_rows, rootCat]) => {
    for (i = 0; i < rows.length; i++) {
      if (rows[i].parentCat === null) {
        Promise.all([categoryModel.countPostRootCat(rows[i].id), i])
          .then(([values, pos]) => {
            rows[pos].numPosts = values[0].nPosts;
          }).catch(next);
      }
    }
    var total = count_rows[0].total;
    var nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;
    var pages = [];
    for (i = 1; i <= nPages; i++) {
      var obj = { value: i, active: i === +page };
      pages.push(obj);
    }

    res.render('management/admin/vWCategories/categories.hbs', {
      categories: rows,
      rootCategories: rootCat,
      pages
    });
  }).catch(next);
})

router.get('/is-available', (req, res, next) => {
  var cat_name = req.query.cat_name;
  var id = req.query.id;
  console.log(id);
  console.log(cat_name);
  Promise.all(
  [categoryModel.singleByCatName(cat_name, id)]).then(([rows]) => {
    if (rows.length > 0) {
      return res.json(false);
    }
    return res.json(true);
  }).catch(next);
})

// router.get('/', (req, res) => {
//   categoryModel.getList()
//     .then(rows => {
//       categoryModel.rootCat()
//         .then(rootCat => {
//           res.render('management/admin/vWCategories/categories.hbs', {
//             categories: rows,
//             rootCategories: rootCat
//           });
//         }).catch(err => {
//           console.log(err);
//           res.end('error occured.')
//         });
//     }).catch(err => {
//       console.log(err);
//       res.end('error occured.')
//     });
// })

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
  var catID = req.params.id;
  var entity = {
    id: catID,
    is_deleted: 1
  }

  categoryModel.update(entity).then(n => {
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