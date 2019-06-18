var db = require('../utils/database');

module.exports = {
    all: () => {
        return db.load('select * from category where is_deleted = 0');
    },

    rootCat: () => {
        return db.load('select * from category where is_deleted = 0 and parent_cat is null');
    },

    exceptRootCat: () => {
        return db.load('select * from category where is_deleted = 0 and parent_cat is not null');
    },

    exceptRootCatExistPost: () => {
        return db.load(`select DISTINCT c.id, c.cat_name, c.parent_cat, c.is_deleted from category c, post p 
            where c.is_deleted = 0 and c.parent_cat is not null and c.id = p.id_category 
            and p.id_status=1 and p.date_posted is not null and p.date_posted<=NOW()`);
    },

    subCategories: (CatId) => {
        return db.load(`select * from category where is_deleted = 0 and parent_cat = ${CatId}`);
    },

    getCategoryById: (CatID) => {
        return db.load(`select * from category where is_deleted = 0 and id = ${CatID}`);
    },

    getList: () => {
        return db.load(`SELECT cat.id, cat.cat_name, cat2.cat_name as parentCat, count(post.id) as numPosts 
        FROM category cat LEFT JOIN category cat2 on cat.parent_cat = cat2.id LEFT JOIN post on cat.id = post.id_category and post.is_deleted = 0 
        WHERE cat.is_deleted = 0 GROUP BY cat.id`);
    },

    pageCat: (limit, offset) =>{
        return db.load(`SELECT cat.id, cat.cat_name, cat2.id as parentCatID, cat2.cat_name as parentCat, count(post.id) as numPosts 
        FROM category cat LEFT JOIN category cat2 on cat.parent_cat = cat2.id LEFT JOIN post on cat.id = post.id_category and post.is_deleted = 0 
        WHERE cat.is_deleted = 0 GROUP BY cat.id limit ${limit} offset ${offset}`);
    },

    count:()=>{
        return db.load(`select count(*) as total from category where is_deleted = 0`);
    },

    countPostRootCat:(CatID)=>{
        return db.load(`Select COUNT(*) as nPosts from post, category cat 
        where cat.parent_cat = ${CatID} and cat.id = post.id_category and post.is_deleted = 0 and cat.is_deleted = 0`);
    },

    singleByCatName:(cat_name, id)=>{
        return db.load(`select * from category cat where cat.cat_name = N'${cat_name}' and cat.id != '${id}' and cat.is_deleted = 0`);
    },

    getCatByName:(cat_name)=>{
        return db.load(`SELECT cat.id from category cat WHERE cat.cat_name = N'${cat_name}' and cat.is_deleted = 0`);
    },

    add: entity => {
        return db.add('category', entity);
    },

    update: entity => {
        return db.update('category', 'id', entity);
    },

    delete: id => {
        return db.delete('category', 'id', id);
    }
}