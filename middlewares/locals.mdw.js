var Categories = require('../models/category.model');

var moment = require('moment');

module.exports = (req, res, next) => {
    var results = [];

    Categories.rootCat()
        .then(rootCats => {

            var arrPromises = [];

            var arrKeys = [];

            Array.from(rootCats).forEach((value, index) => {
                arrKeys.push(value);

                var p = Categories.subCategories(value.id);
                arrPromises.push(p);
            });

            Promise.all(arrPromises).then(values => {
                for (var i = 0; i < values.length; i++) {
                    results.push({
                        root: arrKeys[i],
                        childs: values[i]
                    });
                }
                res.locals.lcCategories = results;

                var current = new Date();

                res.locals.currentTime = {
                    isSunday : current.getDay() === 0 ? true : false,
                    day : current.getDay(),
                    DMY : moment(current).format('DD/MM/YYYY')
                }
                next();
            })

            // next();
        })
        .catch(err => {
            next();
        });
};
