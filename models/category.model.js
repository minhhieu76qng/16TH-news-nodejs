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

    exceptRootCatExistPost : () => {
        return db.load('select DISTINCT c.id, c.cat_name, c.parent_cat, c.`status` from category c, post p where c.status = 1 and c.parent_cat is not null and c.id = p.id_category');
    },

    subCategories : (CatId) => {
        return db.load(`select * from category where status = 1 and parent_cat = ${CatId}`);
    }
}