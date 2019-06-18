var exp = require('express');
var drafpostModel = require('../../models/drafpost.model');
var auth = require('../../middlewares/auth.mdw')
var router = exp.Router();

router.get('/waitingpost', auth, (req, res) => {
  res.locals.pageTitle = 'Kiểm duyệt bài viết';
  var page = req.query.page || 1;
  if(page<1) page = 1;
  var limit = 10;
  var offset = (page - 1) * limit;
  const UserID = req.user.id;

  Promise.all([
    drafpostModel.waiting(UserID,limit,offset),
    drafpostModel.countpostwaiting(UserID),
  ])
  .then(([rows, count_rows])=>{
    var total = count_rows[0].total;
    var countPage = Math.floor(total/limit);
    if(total % limit >0) countPage++;
    var paging = [];
    for(i=1;i<=countPage;i++){
      var object = {value: i, active: i === +page};
      paging.push(object);
    }
    res.render('management/editor/waitingpost.hbs', {
      waitingposts: rows,
      paging
    });
  })
  .catch(err=>{
    console.log(err);
    res.end('error occured.')
  });
  
})

router.get('/publishpost', auth, (req, res) => {
  res.locals.pageTitle = 'Kiểm duyệt bài viết';
  var page = req.query.page || 1;
  if(page<1) page = 1;
  var limit = 10;
  var offset = (page - 1) * limit;
  const UserID = req.user.id;

  Promise.all([
    drafpostModel.waiting(UserID,limit,offset),
    drafpostModel.countpostwaiting(UserID),
  ])
  .then(([rows, count_rows])=>{
    var total = count_rows[0].total;
    var countPage = Math.floor(total/limit);
    if(total % limit >0) countPage++;
    var paging = [];
    for(i=1;i<=countPage;i++){
      var object = {value: i, active: i === +page};
      paging.push(object);
    }
    res.render('management/editor/publishpost.hbs', {
      waitingposts: rows,
      paging
    });
  })
  .catch(err=>{
    console.log(err);
    res.end('error occured.')
  });
  
})

router.get('/draftpost', auth, (req, res) => {
  res.locals.pageTitle = 'Kiểm duyệt bài viết';
  var page = req.query.page || 1;
  if(page<1) page = 1;
  var limit = 10;
  var offset = (page - 1) * limit;
  const UserID = req.user.id;

  Promise.all([
    drafpostModel.draft(UserID,limit,offset),
    drafpostModel.countdraftpost(UserID),
  ])
  .then(([rows, count_rows])=>{
    var total = count_rows[0].total;
    var countPage = Math.floor(total/limit);
    if(total % limit >0) countPage++;
    var paging = [];
    for(i=1;i<=countPage;i++){
      var object = {value: i, active: i === +page};
      paging.push(object);
    }
    console.log(rows)
    res.render('management/editor/draftpost.hbs', {
      draftposts: rows,
      paging
    });
  })
  .catch(err=>{
    console.log(err);
    res.end('error occured.')
  });
  
})

module.exports = router;