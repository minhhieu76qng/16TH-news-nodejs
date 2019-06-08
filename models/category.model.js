var db = require('../utils/database');

module.exports = {
    all : () => {
        return db.load('select * from category where status = 1');
    },

    rootCat : () => {
        return db.load('select * from category where status = 1 and parent_cat is null');
    },

    exceptRootCat : () => {
        return db.load('select * from category where status = 1 and parent_cat is not null');
    },

    subCategories : (CatId) => {
        return db.load(`select * from category where status = 1 and parent_cat = ${CatId}`);
    }
}