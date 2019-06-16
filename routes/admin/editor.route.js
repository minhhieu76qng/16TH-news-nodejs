var exp = require('express');
var user_model = require('../../models/user.model');
var account_type = require('../../models/user_type.model');
var user_account_type = require('../../models/user_account_type.model');
var categoryModel = require('../../models/category.model');
var user_cat = require('../../models/user_category.model');
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
        user_model.pageEditor(limit, offset),
        user_model.countOfType("EDITOR"),
        categoryModel.rootCat(),
        categoryModel.exceptRootCat()
    ]).then(([rows, count_rows, rootCat, childCat]) => {
        var editors = [];
        for (i = 0; i < rows.length; i++) {
            Promise.all([user_cat.getCatManagenment(rows[i].id), i])
                .then(([values, pos]) => {
                    var strCatManagement = ""
                    if (values.length > 0) {
                        strCatManagement = values[0].cat_name;
                    }

                    if (values.length > 1) {
                        strCatManagement += " ...";
                    }

                    var catManagementHTML = "";
                    // chuỗi có dạng "id1 id2 id3 "
                    var strCatID = "";
                    for (i = 0; i < values.length; i++) {
                        strCatID += values[i].id.toString() + " ";
                        catManagementHTML += '<li>' + values[i].cat_name + '</li>';
                    }

                    var obj = {
                        id: rows[pos].id,
                        name: rows[pos].name,
                        dob: my_utils.toDateString(rows[pos].dob),
                        email: rows[pos].email,
                        catManagement: values,
                        strCatManagement: strCatManagement,
                        strCatID: strCatID,
                        catManagementHTML: catManagementHTML
                    };
                    editors.push(obj);
                }).catch(next);
        }

        var total = count_rows[0].total;
        var nPages = Math.floor(total / limit);
        if (total % limit > 0) nPages++;
        var pages = [];
        for (i = 1; i <= nPages; i++) {
            var obj = { value: i, active: i === +page };
            pages.push(obj);
        }

        //Phân level chuyên mục
        var rootCategories = [];
        for (i = 0; i < rootCat.length; i++) {
            var childCategories = [];
            for (j = 0; j < childCat.length; j++) {
                if (rootCat[i].id === childCat[j].parent_cat) {
                    childCategories.push(childCat[j]);
                }
            }
            var obj = {
                id: rootCat[i].id,
                cat_name: rootCat[i].cat_name,
                childCategories: childCategories
            };
            rootCategories.push(obj);
        }

        res.render('management/admin/vWUsers/editor.hbs', {
            editors,
            pages,
            rootCategories
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
    var catManagement = req.body.catManagement;
    console.log(catManagement[0]);
    var user = {
        name: name,
        dob: dob,
        email: email,
        password: pwHash
    };

    user_model.addNewUser(user)
        .then(userID => {

            account_type.accountTypeByType('EDITOR')
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
                                //phân công chuyên mục cho editor 
                                //dễ gặp bug đa luồng
                                var pos = 0;
                                for (i = 0; i < catManagement.length; i++) {
                                    var obj = {
                                        id_user: userID,
                                        id_category: catManagement[i]
                                    };
                                    pos++;
                                    if (pos === catManagement.length) {
                                        user_cat.add(obj)
                                            .then(id => {
                                                res.redirect('/admin');
                                            })
                                            .catch(next);
                                    }
                                    else {
                                        user_cat.add(obj)
                                            .then(id => {
                                            })
                                            .catch(next);
                                    }
                                }

                            })
                            .catch(next);
                    }
                })
                .catch(next);
        })
        .catch(next);
})

router.post('/assign/:id', (req, res, next) => {
    var userID = req.params.id;
    var catManagement = req.body.catManagement;
    user_cat.deleteByID(userID)
        .then(value => {
            //phân công chuyên mục cho editor 
            //dễ gặp bug đa luồng
            var pos = 0;
            for (i = 0; i < catManagement.length; i++) {
                var obj = {
                    id_user: userID,
                    id_category: catManagement[i]
                };
                pos++;
                if (pos === catManagement.length) {
                    user_cat.add(obj)
                        .then(id => {
                            res.redirect('/admin');
                        })
                        .catch(next);
                }
                else {
                    user_cat.add(obj)
                        .then(id => {
                        })
                        .catch(next);
                }
            }
        }).catch(next);
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