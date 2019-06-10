var db = require('../utils/database');

module.exports = {
    all: () => {
        return db.load('select * from category where status = 1');
    },

    rootCat: () => {
        return db.load('select * from category where status = 1 and parent_cat is null');
    },

    exceptRootCat: () => {
        return db.load('select * from category where status = 1 and parent_cat is not null');
    },

    exceptRootCatExistPost: () => {
        return db.load('select DISTINCT c.id, c.cat_name, c.parent_cat, c.`status` from category c, post p where c.status = 1 and c.parent_cat is not null and c.id = p.id_category');
    },

    subCategories: (CatId) => {
        return db.load(`select * from category where status = 1 and parent_cat = ${CatId}`);
    },

    getList: () => {
        return db.load('SELECT cat.id, cat.cat_name, cat2.cat_name as parentCat, count(post.id) as numPosts FROM category cat LEFT JOIN category cat2 on cat.parent_cat = cat2.id LEFT JOIN post on cat.id = post.id_category and post.is_deleted = 0 WHERE cat.status = 1 GROUP BY cat.id');
    },

    add: entity => {
        return db.add('category', entity);
    },

    update: entity => {
        return db.update('category', 'id', entity);
    },

    delete: id => {
        return db.delete('category', 'id', id);
    },
}