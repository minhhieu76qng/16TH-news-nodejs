var exp = require('express');
var user_model = require('../../models/user.model');
var account_type = require('../../models/user_type.model');
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
        user_model.pageWriter(limit, offset),
        user_model.countOfType('WRITER')
    ]).then(([rows, count_rows]) => {
        //Format ngay sinh
        for (i = 0; i < rows.length; i++) {
            rows[i].dob = my_utils.toDateString(rows[i].dob);
        }

        var total = count_rows[0].total;
        var nPages = Math.floor(total / limit);
        if (total % limit > 0) nPages++;
        var pages = [];
        for (i = 1; i <= nPages; i++) {
            var obj = { value: i, active: i === +page };
            pages.push(obj);
        }

        res.render('management/admin/vWUsers/writer.hbs', {
            writers: rows,
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
    var pseudonym = req.body.pseudonym;
    var pwHash = bcrypt.hashSync(req.body.password, 10);
    // ngày hết hạn là 7 ngày sau khi đăng ký
    var user = {
        name: name,
        dob: dob,
        email: email,
        password: pwHash,
        pseudonym: pseudonym
    };

    user_model.addNewUser(user)
        .then(userID => {

            account_type.accountTypeByType('WRITER')
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