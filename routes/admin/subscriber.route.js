var exp = require('express');
var user_model = require('../../models/user.model');
var account_type = require('../../models/user_type');
var user_account_type = require('../../models/user_account_type.model');
var my_utils = require('../../utils/myUtils');
var moment = require('moment');
var bcrypt = require('bcrypt');

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
        user_model.pageSubscriber(limit, offset),
        user_model.countOfType("SUBSCRIBER")
    ]).then(([rows, count_rows]) => {
        //Sua ngay het han va ngay sinh
        var subscribers = [];
        var current = new Date();
        for (i = 0; i < rows.length; i++) {
            var obj = {
                id: rows[i].id,
                name: rows[i].name,
                dob: my_utils.toDateString(rows[i].dob),
                email: rows[i].email,
                exp_date: rows[i].exp_date === null ? "" : my_utils.toDateString(rows[i].exp_date),
                status: '<span class="badge badge-success">Premium</span>'
            };
            if (obj.exp_date === "") {
                obj.status = '<span class="badge badge-warning">Hết hạn</span>';
            }
            else if (moment(current).format('YYYY/MM/DD') > moment(rows[i].exp_date).format('YYYY/MM/DD')) {
                obj.status = '<span class="badge badge-warning">Hết hạn</span>';
            }
            subscribers.push(obj);
        }

        var total = count_rows[0].total;
        var nPages = Math.floor(total / limit);
        if (total % limit > 0) nPages++;
        var pages = [];
        for (i = 1; i <= nPages; i++) {
            var obj = { value: i, active: i === +page };
            pages.push(obj);
        }

        res.render('management/admin/vWUsers/subscriber.hbs', {
            subscribers,
            pages
        });
    }).catch(next);
})

router.get('/is-available', (req, res) => {
    var email = req.query.email;

    user_model.singleByEmail(email).then(rows => {
        if (rows.length > 0) {
            return res.json(false);
        }
        return res.json(true);
    })
})

router.post('/register', (req, res, next) => {
    const saltRounds = 10;

    var name = req.body.name;
    var dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var email = req.body.email;
    var pwHash = bcrypt.hashSync(req.body.password, 10);
    // ngày hết hạn là 7 ngày sau khi đăng ký
    var date = new Date();
    date = new Date(date.getTime() + (7 * 24 * 60 * 60 * 1000));
    var exp_date = moment(date).format('YYYY-MM-DD');
    var user = {
        name: name,
        dob: dob,
        email: email,
        password: pwHash,
        exp_date: exp_date
    };

    user_model.addNewUser(user)
        .then(userID => {

            account_type.accountTypeByType('SUBSCRIBER')
                .then(rows => {
                    if (rows.length === 0) {
                        throw new Event('Not exists user type!');
                    } else {
                        var userAccountType = {
                            id_user: userID,
                            id_account_type: rows[0].id
                        };

                        user_account_type.addNewUserAccountType(userAccountType)
                            .then(id => {
                                res.redirect('/admin');
                            })
                            .catch(next);
                    }
                })
                .catch(next);
        })
        .catch(next);
})

router.post('/renew/:id', (req, res) => {
    var userID = req.params.id;
    var nDayRenew = req.body.nDayRenew;
    //lấy ngày hết hạn
    user_model.getExpDate(userID)
        .then(value => {
            var current = new Date();
            var newDate = new Date();
            //nếu ngày hết hạn bé hơn ngày hiện tại thì lấy ngày hiện tại cộng lên
            if(moment(current).format('YYYY/MM/DD') > moment(value[0].exp_date).format('YYYY/MM/DD'))
            {
                newDate = new Date(current.getTime() + (nDayRenew * 24 * 60 * 60 * 1000));
            }
            else{
                var date = new Date(value[0].exp_date);
                newDate = new Date(date.getTime() + (nDayRenew * 24 * 60 * 60 * 1000));
            }

            var entity = {
                id: userID,
                exp_date: moment(newDate).format('YYYY-MM-DD')
            }
        
            user_model.update(entity).then(n => {
                //res.redirect('/admin/categories');
                res.redirect('/admin');
            }).catch(err => {
                console.log(err);
                res.end('error occured.')
            });
        })
        .catch(err => {
            console.log(err);
            res.end('error occured.')
        });
})

router.get('/ban/:id', (req, res) => {
    var userID = req.params.id;
    var entity = {
      id: userID,
      is_deleted: 1
    }
  
    user_model.update(entity).then(n => {
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